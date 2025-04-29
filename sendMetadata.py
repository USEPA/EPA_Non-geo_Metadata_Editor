#! Script handler for submitting Non-Geo Metadata records
# Torrin Hultgren, November 2018 - revised for python 3 in 2022

# Import modules for CGI handling 
import cgi, cgitb, smtplib, requests, json
from collections import OrderedDict
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

cgitb.enable(display=0, logdir=".")

# Create instance of FieldStorage 
form = cgi.FieldStorage() 

sender = 'EPA Open Data Metadata Editor <edg@epa.gov>'
recipients = ['edg@epa.gov']

recaptchaURL = "https://awstobler.epa.gov/googleProxy/nonGeoRecaptchaVerify.asp"

# Prepare response text
print("Content-type:application/json\r\n\r\n")
#print("Content-type:text/plain\r\n\r\n")
#print("Content-type:text/html\r\n\r\n")

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
    
try:
    # Verify recaptcha token before proceeding
    token  = form.getvalue('token')
    recaptchaData = {"token":token}
    r = requests.get(url=recaptchaURL, params=recaptchaData)
    response = r.json()
    if response["success"]:
        # Get data from fields
        if 'metadata' in form:
            metadata = form.getvalue('metadata')
        else:
            raise Exception("Missing metadata body")
        if 'sponsorEmail' in form:
            sponsorEmail = form.getvalue('sponsorEmail')
        else:
            sponsorEmail = ""
        if 'agreementType' in form:   
            agreementType = form.getvalue('agreementType')
        if 'agreementNumber' in form:     
            agreementNumber = form.getvalue('agreementNumber')
        if 'epaUserName' in form: 
            epaUserName = form.getvalue('epaUserName')
        else:
            epaUserName = ""
        if 'repoURL' in form: 
            repoURL = form.getvalue('repoURL')
        else:
            repoURL = "New submission, no previous record"
        # Process metadata submission
        dcat = OrderedDict(json.loads(metadata)['dataset'][0]).copy()
        # Reorder so title and description are always first - the rest don't matter much.
        dcat.move_to_end('description',last=False)
        dcat.move_to_end('title',last=False)
        #dcat = move_element(dcat,'title',0)
        #dcat = move_element(dcat,'description',1)
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
        smtpObj.sendmail(sender, recipients, msg.as_string())         
        print('{"status": "success"}')
        smtpObj.quit()
    else:
        raise Exception(response["error-codes"])
except Exception as e:
    print('{"status": "failure","message":"%s"}' %(e))
    #print(e)
