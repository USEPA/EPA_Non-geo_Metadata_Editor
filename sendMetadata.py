#! Script handler for submitting Non-Geo Metadata records
# Torrin Hultgren, November 2018

# Import modules for CGI handling 
import cgi, cgitb, smtplib, requests, json, collections
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

cgitb.enable(display=0, logdir=".")

# Create instance of FieldStorage 
form = cgi.FieldStorage() 

sender = 'EPA Open Data Metadata Editor <edg@epa.gov>'
recipients = ['edg@epa.gov']

recaptchaURL = "http://edg-intranet.epa.gov/googleProxy/nonGeoRecaptchaVerify.asp"

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
    response = json.loads(r.text)
    if response["success"]:
        # Get data from fields
        if form.has_key('metadata'):
            metadata = form.getvalue('metadata')
        else:
            raise Exception("Missing metadata body")
        if form.has_key('sponsorEmail'):
            sponsorEmail = form.getvalue('sponsorEmail')
        else:
            sponsorEmail = ""
        if form.has_key('agreementType'):   
            agreementType = form.getvalue('agreementType')
        if form.has_key('agreementNumber'):     
            agreementNumber = form.getvalue('agreementNumber')
        if form.has_key('epaUserName'): 
            epaUserName = form.getvalue('epaUserName')
        else:
            epaUserName = ""
        if form.has_key('repoURL'): 
            repoURL = form.getvalue('repoURL')
        else:
            repoURL = "New submission, no previous record"
        # Process metadata submission
        dcat = json.loads(metadata, object_pairs_hook=collections.OrderedDict)['dataset'][0]
        dcat = move_element(dcat,'title',0)
        dcat = move_element(dcat,'description',1)
        if sponsorEmail:
            dcat['title'] = addExtra(dcat['title'])
        dcat.pop('epa_contact')

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
%s submitted the metadata record below to the U.S. EPA via the Open Data Metadata Editor while logged in as %s. 

Target location: %s
Submitted metadata:

%s
    """ % (publisher, epaUserName, repoURL, json.dumps(dcat, indent=4))
            html = """\
<p>Hello EDG Team,</p>
<p>%s submitted the metadata record below to the U.S. EPA via the Open Data Metadata Editor while logged in as %s.</p>
<p>Target location: %s</p>
<p>Submitted metadata: </p>
<pre><code>%s</code></pre>
""" % (publisher, epaUserName, repoURL, json.dumps(dcat, indent=4))        
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
except Exception, e:
    print('{"status": "failure","message":"%s"}' %(e))
    #print(e)
