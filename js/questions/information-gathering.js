/**
 * Questions for the Information Gathering chapter
 */
quizDataByChapter.informationGathering = [
    {
        question: "What is information gathering in penetration testing?",
        options: [
            "A phase where vulnerabilities are exploited",
            "The first step of a penetration test involving collecting information about the target",
            "A process of reporting findings to the client",
            "The process of patching systems after testing"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Information gathering is the first step of any penetration test and involves gathering or collecting information about an individual, company, website, or system that you are targeting. The more information you have on your target, the more successful you will be during the latter stages of a penetration test."
    },
    {
        question: "What is passive information gathering?",
        options: [
            "Gathering information by directly interacting with the target system",
            "Gathering information without directly engaging with the target",
            "Using social engineering to gather credentials",
            "Scanning ports on the target system"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Passive information gathering involves gathering as much information as possible without actively engaging with the target. This includes using publicly available sources and techniques that don't create suspicious traffic or alerts on the target systems."
    },
    {
        question: "Which of the following is NOT typically part of passive information gathering?",
        options: [
            "Looking up domain registration information",
            "Searching for email addresses on social media",
            "Scanning open ports on the target server",
            "Identifying web technologies using browser extensions"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Scanning open ports on the target server is an active information gathering technique, as it involves directly interacting with the target system. Passive information gathering methods do not directly engage with the target systems."
    },
    {
        question: "What type of information is typically gathered during the 'Whois enumeration' process?",
        options: [
            "Operating system versions",
            "Domain registration details and ownership information",
            "Computer hardware specifications",
            "Active directory usernames"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Whois enumeration is a process of querying domain registrars to gather domain registration details including owner information, contact details, nameservers, registration and expiration dates, and other administrative information about the domain."
    },
    {
        question: "What is a DNS zone transfer?",
        options: [
            "A process of replicating DNS records from a primary DNS server to a secondary server",
            "Changing DNS servers for a domain",
            "A method of DNS poisoning",
            "Converting domain names to IP addresses"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "A DNS zone transfer is a process where DNS server admins copy or transfer zone files from one DNS server to another. If misconfigured and left unsecured, this functionality can be abused by attackers to copy the zone file from the primary DNS server to another DNS server, potentially revealing sensitive network information."
    },
    {
        question: "What DNS record type resolves a domain name to an IPv4 address?",
        options: [
            "A record",
            "AAAA record",
            "MX record",
            "CNAME record"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "The A (Address) record is used to map a domain name to an IPv4 address. This is one of the most common DNS record types and is essential for basic domain name resolution."
    },
    {
        question: "What does the MX record in DNS specify?",
        options: [
            "The domain's IP address",
            "The mail server responsible for accepting email",
            "The domain's name servers",
            "Domain aliases"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The MX (Mail Exchange) record specifies the mail servers responsible for accepting email on behalf of a domain. MX records include a priority value to determine which mail server should be used if multiple servers are available."
    },
    {
        question: "What tool is commonly used for email harvesting during penetration testing?",
        options: [
            "Nmap",
            "theHarvester",
            "Burp Suite",
            "Wireshark"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "theHarvester is a tool specifically designed for email harvesting and information gathering. It collects emails, names, subdomains, IPs, and URLs from various public data sources to help penetration testers gather information about their targets."
    },
    {
        question: "What are Google Dorks used for in information gathering?",
        options: [
            "Scanning networks for open ports",
            "Creating specialized search queries to find specific information",
            "Cracking passwords in Google services",
            "Exploiting vulnerabilities in Google Chrome"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Google Dorks are specialized search queries that use advanced search operators to find specific information. Penetration testers use them to discover sensitive information that may be inadvertently exposed on websites, such as login pages, sensitive documents, or configuration files."
    },
    {
        question: "What is the purpose of WAF detection tools like wafw00f?",
        options: [
            "To identify if a website is using a Web Application Firewall and what type",
            "To create a web application firewall",
            "To bypass login forms on websites",
            "To perform SQL injection attacks"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "WAF detection tools like wafw00f are used to identify if a target website is protected by a Web Application Firewall (WAF) and, if possible, determine what specific type of WAF is in use. This information is valuable for penetration testers to understand the security measures in place before attempting further testing."
    },
    {
        question: "What is subdomain enumeration?",
        options: [
            "Finding all the possible paths on a website",
            "Discovering various subdomains that exist for a domain",
            "Counting the number of domains owned by an organization",
            "Determining the hierarchy of domains in DNS"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Subdomain enumeration is the process of discovering various subdomains (like mail.example.com, admin.example.com) that exist for a main domain. Tools like Sublist3r can help automate this process by querying various public sources to identify subdomains."
    },
    {
        question: "Why is checking leaked password databases important in information gathering?",
        options: [
            "To find unpatched websites",
            "To identify if target organization credentials have been compromised in past breaches",
            "To get the administrator password for the target",
            "To legally access the target's systems"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Checking leaked password databases is important to identify if the target organization's employee credentials have been compromised in past data breaches. This information can reveal common password patterns within the organization or potentially valid credentials that could be used in the penetration test if the employees haven't changed their passwords."
    },
    {
        question: "What type of information can be gathered from Netcraft?",
        options: [
            "Passwords and login credentials",
            "Web server type, OS, web technologies, and hosting information",
            "Source code of the target website",
            "Employee personal information"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Netcraft provides information about web servers, including the type of web server, operating system, web technologies being used, hosting information, and historical data about the website. This passive reconnaissance tool helps penetration testers understand the technical architecture of target websites."
    },
    {
        question: "What does DNS interrogation involve?",
        options: [
            "Interviewing DNS administrators",
            "The process of enumerating DNS records for a specific domain",
            "Cracking DNS passwords",
            "Shutting down DNS servers"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "DNS interrogation is the process of enumerating DNS records for a specific domain. The objective is to probe a DNS server to provide information like IP addresses, subdomains, mail server addresses, and other DNS records for a specific domain."
    },
    {
        question: "What kind of information is typically NOT obtained through passive information gathering?",
        options: [
            "Domain ownership information",
            "Email addresses from public sources",
            "Open ports on target systems",
            "Technologies used on the target website"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Open ports on target systems are typically not obtained through passive information gathering. Discovering open ports requires active scanning of the target system, which is considered active information gathering as it involves direct interaction with the target."
    },
    {
        question: "What is a TXT record in DNS commonly used for?",
        options: [
            "Storing IP addresses",
            "Specifying mail servers",
            "Storing human-readable text information like SPF records or domain verification",
            "Creating domain aliases"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "TXT (Text) records in DNS are used to store text information that can be read by external sources. Common uses include domain ownership verification, SPF (Sender Policy Framework) records for email security, DKIM (DomainKeys Identified Mail) information, and various other verification or identification purposes."
    },
    {
        question: "What DNS record type is used for IPv6 addresses?",
        options: [
            "A record",
            "AAAA record",
            "CNAME record",
            "PTR record"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The AAAA record (also called a quad-A record) is used to map a domain name to an IPv6 address. This is similar to how an A record maps a domain to an IPv4 address, but it's specifically for the newer IPv6 addressing scheme."
    },
    {
        question: "What is the purpose of the SOA record in DNS?",
        options: [
            "Specifies the domain's IP address",
            "Contains authority information about the DNS zone",
            "Lists all email servers for the domain",
            "Maps hostnames to IP addresses"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The SOA (Start of Authority) record contains administrative information about the DNS zone, including the primary nameserver, the email address of the domain administrator, domain serial number, and various timer values that affect DNS record caching and zone transfers."
    },
    {
        question: "Why is website footprinting important in penetration testing?",
        options: [
            "To determine if a website has valuable content",
            "To gather information about web technologies, hidden directories, and potential vulnerabilities",
            "To check if the website is popular",
            "To determine if the website needs a redesign"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Website footprinting is important in penetration testing because it helps gather information about web technologies being used, hidden directories, IP addresses, names, emails, potential entry points, and other information that can be useful for identifying potential vulnerabilities and planning the penetration test approach."
    },
    {
        question: "What is the primary concern with misconfigured DNS zone transfers?",
        options: [
            "They can cause DNS servers to crash",
            "They can reveal internal network information to unauthorized parties",
            "They can cause websites to load slowly",
            "They waste network bandwidth"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Misconfigured DNS zone transfers are a security concern because they can allow unauthorized users to copy the entire zone file from a primary DNS server, revealing comprehensive information about the organization's network including internal hostnames, IP addresses, and network topology. This provides attackers with valuable information for planning further attacks."
    },
    {
        question: "What is a PTR record in DNS used for?",
        options: [
            "Mapping domain names to IPv6 addresses",
            "Specifying mail servers",
            "Mapping IP addresses to domain names (reverse DNS lookup)",
            "Creating domain aliases"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "A PTR (Pointer) record is used for reverse DNS lookups, mapping an IP address to a domain name. While A records map domain names to IP addresses, PTR records do the opposite, allowing the resolution of an IP address to its associated hostname."
    }
];