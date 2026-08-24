#! Script handler for submitting Non-Geo Metadata records
# Torrin Hultgren, November 2018 - revised for python 3 in 2022

import json
import os
import smtplib
import sys
import traceback
import urllib.parse
import requests
from collections import OrderedDict
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

sender = 'EPA Open Data Metadata Editor <edg@epa.gov>'
recaptchaURL = "https://awstobler.epa.gov/googleProxy/nonGeoRecaptchaVerify.asp"
recaptchaTimeout = 10


def getInputStream():
    for inputStream in (sys.stdin, sys.__stdin__):
        if inputStream is not None:
            return getattr(inputStream, 'buffer', inputStream)

    try:
        return open(0, 'rb', closefd=False)
    except (OSError, ValueError):
        pass

    if os.name == 'nt':
        import ctypes
        import msvcrt

        getStdHandle = ctypes.windll.kernel32.GetStdHandle
        getStdHandle.argtypes = [ctypes.c_ulong]
        getStdHandle.restype = ctypes.c_void_p
        handle = getStdHandle(-10 & 0xffffffff)
        invalidHandle = ctypes.c_void_p(-1).value
        if handle not in (None, 0, invalidHandle):
            descriptor = msvcrt.open_osfhandle(handle, os.O_RDONLY | os.O_BINARY)
            return os.fdopen(descriptor, 'rb', closefd=False)

    raise RuntimeError("CGI standard input is unavailable")


def parseForm(environ=None, inputStream=None):
    environ = os.environ if environ is None else environ
    inputStream = getInputStream() if inputStream is None else inputStream
    form = urllib.parse.parse_qs(
        environ.get('QUERY_STRING', ''), keep_blank_values=True
    )

    contentLength = environ.get('CONTENT_LENGTH', '')
    if not contentLength:
        return form

    try:
        contentLength = int(contentLength)
    except ValueError as error:
        raise ValueError("Invalid CONTENT_LENGTH") from error
    if contentLength < 0:
        raise ValueError("Invalid CONTENT_LENGTH")

    contentType = environ.get('CONTENT_TYPE', '').partition(';')[0].strip().lower()
    if contentType != 'application/x-www-form-urlencoded':
        raise ValueError("Unsupported Content-Type")

    body = inputStream.read(contentLength)
    if isinstance(body, bytes):
        body = body.decode('utf-8')
    bodyForm = urllib.parse.parse_qs(body, keep_blank_values=True)
    for key, values in bodyForm.items():
        form.setdefault(key, []).extend(values)
    return form


def getField(form, name, required=False, default=''):
    values = form.get(name, [])
    if len(values) > 1:
        raise ValueError("Multiple values supplied for %s" % name)
    if not values:
        if required:
            raise ValueError("Missing %s" % name)
        return default
    if required and not values[0]:
        raise ValueError("Missing %s" % name)
    return values[0]


def verifyRecaptcha(token):
    r = requests.post(url=recaptchaURL, data={'token': token}, timeout=recaptchaTimeout)
    response = r.json()

    if not isinstance(response, dict):
        raise ValueError("Invalid reCAPTCHA response")
    if not response.get('success'):
        errors = response.get('error-codes', ['reCAPTCHA verification failed'])
        raise ValueError(errors)

def emailToName(email):
    dottedName = email.split('@')[0]
    nameList = dottedName.split('.')
    nameList.reverse()
    nameList = [name.capitalize() for name in nameList]
    nameString = " ".join(nameList)
    return nameString

def addExtra(title):
    if (title[:21] != '[Extramural Research]'):
        title = '[Extramural Research] ' + title
    return title

def move_element(odict, thekey, newpos):
    odict[thekey] = odict.pop(thekey)
    i = 0
    for key, value in odict.items():
        if key != thekey and i >= newpos:
            odict[key] = odict.pop(key)
        i += 1
    return odict


def submitMetadata(form):
    # Verify recaptcha token before proceeding
    token = getField(form, 'token', required=True)
    verifyRecaptcha(token)

    metadata = getField(form, 'metadata', required=True)
    sponsorEmail = getField(form, 'sponsorEmail')
    agreementType = getField(form, 'agreementType')
    agreementNumber = getField(form, 'agreementNumber')
    epaUserName = getField(form, 'epaUserName')
    repoURL = getField(
        form, 'repoURL', default="New submission, no previous record"
    )

    document = json.loads(metadata, object_pairs_hook=OrderedDict)
    datasets = document.get('dataset') if isinstance(document, dict) else None
    if not isinstance(datasets, list) or not datasets:
        raise ValueError("Metadata must contain at least one dataset")
    if not isinstance(datasets[0], dict):
        raise ValueError("Metadata dataset must be an object")

    # Process metadata submission
    dcat = OrderedDict(datasets[0]).copy()
    # Reorder so title and description are always first - the rest don't matter much.
    dcat.move_to_end('description', last=False)
    dcat.move_to_end('title', last=False)
    if sponsorEmail:
        dcat['title'] = addExtra(dcat['title'])
    # Remove EPA contact from submission
    if 'epa_contact' in dcat:
        del dcat['epa_contact']
    # Limit BureauCode to a single value (it often gets out of control).
    dcat['bureauCode'] = [dcat['bureauCode'][0]]
    # Add Date to the submission
    now = datetime.now()
    dcat['metadataUpdated'] = now.strftime("%Y-%m-%d")

    # Get email recipients
    recipients = ['edg@epa.gov']
    if sponsorEmail:
        recipients.append(sponsorEmail)
        sponsorName = emailToName(sponsorEmail)
    recipients.append(dcat['contactPoint']['hasEmail'][7:])
    publisher = dcat['contactPoint']['fn']

    msg = MIMEMultipart('alternative')
    msg['Subject'] = "EPA Open Data Metadata Submission"
    msg['From'] = sender
    msg['To'] = ", ".join(recipients)
    if epaUserName:
        text = """\
Hello EDG Team,
%s submitted the metadata record below to the U.S. EPA via the Open Data Metadata Editor. 

Target location: %s
Submitted metadata:

%s
    """ % (epaUserName, repoURL, json.dumps(dcat, indent=4))
        html = """\
<p>Hello EDG Team,</p>
<p>%s submitted the metadata record below to the U.S. EPA via the Open Data Metadata Editor.</p>
<p>Target location: %s</p>
<p>Submitted metadata: </p>
<pre><code>%s</code></pre>
""" % (epaUserName, repoURL, json.dumps(dcat, indent=4))
    else:
        text = """\
Hello %s,
%s submitted the metadata record below to the U.S. EPA via the Open Data Metadata Editor as part of the publishing requirements for extramural researchers.

You were listed as the EPA point of contact for this submission and the record will not be accepted without your verification of sponsorship. To confirm, simply reply to this message indicating your confirmation. If you believe you received this message in error, please reply and let us know. Thanks!

EPA Agreement Type: %s
EPA Agreement Number or Description: %s
Submitted metadata:

%s
    """ % (sponsorName, publisher, agreementType, agreementNumber, json.dumps(dcat, indent=4))
        html = """\
<p>Hello %s,</p>
<p>%s submitted the metadata record below to the U.S. EPA via the Open Data Metadata Editor as part of the publishing requirements for extramural researchers.</p>

<p>You were listed as the EPA point of contact for this submission and the record will not be accepted without your verification of sponsorship. To confirm, simply reply to this message indicating your confirmation. If you believe you received this message in error, please reply and let us know. Thanks!</p>

<p>EPA Agreement Type: %s<br/>
EPA Agreement Number or Description: %s</p>
<p>Submitted metadata: </p>
<pre><code>%s</code></pre>
""" % (sponsorName, publisher, agreementType, agreementNumber, json.dumps(dcat, indent=4))
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')
    msg.attach(part1)
    msg.attach(part2)
    smtpObj = smtplib.SMTP('smtp.rtpnc.epa.gov')
    try:
        smtpObj.sendmail(sender, recipients, msg.as_string())
    finally:
        smtpObj.quit()


def writeHeaders(output=None):
    output = sys.stdout if output is None else output
    output.write("Content-Type: application/json\r\n\r\n")
    output.flush()


def writeResponse(payload, output=None):
    output = sys.stdout if output is None else output
    output.write(json.dumps(payload))
    output.write("\n")
    output.flush()


def main():
    writeHeaders()
    try:
        form = parseForm()
        submitMetadata(form)
        payload = {'status': 'success'}
    except Exception as error:
        traceback.print_exc(file=sys.stderr)
        payload = {'status': 'failure', 'message': str(error)}
    writeResponse(payload)


if __name__ == '__main__':
    main()
