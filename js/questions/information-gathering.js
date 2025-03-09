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
    },
    {
        question: "What command line option is used with Nmap to perform a stealth scan?",
        options: [
            "-T",
            "-O",
            "-sS",
            "-A"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "The -sS option in Nmap performs a SYN scan (also known as a stealth scan or half-open scan), which doesn't complete the TCP handshake. This type of scan is less likely to be logged by the target system compared to a full connect scan."
    },
    {
        question: "What is the basic Nmap command syntax to scan a specific target?",
        options: [
            "nmap scan [target]",
            "nmap [options] [target]",
            "nmap [target] [options]",
            "nmap -scan [options] [target]"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The basic Nmap command syntax is 'nmap [options] [target]', where options specify the scan type and additional parameters, and target is the IP address or domain name you want to scan."
    },
    {
        question: "Which of the following commands would you use to perform a DNS zone transfer on a domain?",
        options: [
            "dig @nameserver example.com any",
            "dig @nameserver example.com axfr",
            "nslookup -type=any example.com nameserver",
            "host -t any example.com nameserver"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The command 'dig @nameserver example.com axfr' attempts to perform a DNS zone transfer (AXFR) for the specified domain using the given nameserver. AXFR (Authoritative Zone Transfer) is the specific query type for requesting a zone transfer."
    },
    {
        question: "What is the primary port used by DNS services?",
        options: [
            "Port 25",
            "Port 53",
            "Port 80",
            "Port 443"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "DNS (Domain Name System) services primarily use port 53. Both UDP and TCP protocols on port 53 are used for DNS, with UDP being more common for standard queries and TCP used for operations like zone transfers that may exceed UDP packet size limits."
    },
    {
        question: "What is the command to run theHarvester with Bing as the data source, searching for a specific domain with a limit of 500 results?",
        options: [
            "theHarvester -d domain.com -b bing -l 500",
            "theHarvester -d domain.com -s bing -n 500",
            "theHarvester --domain domain.com --source bing --limit 500",
            "theHarvester -domain domain.com -engine bing -limit 500"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "The correct command for theHarvester is 'theHarvester -d domain.com -b bing -l 500' where -d specifies the domain, -b specifies the data source (bing in this case), and -l sets the search result limit to 500."
    },
    {
        question: "Which Google dork would you use to find sites with exposed .sql files?",
        options: [
            "site:target.com ext:sql",
            "site:target.com filetype:sql",
            "site:target.com inurl:sql",
            "site:target.com intitle:sql"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The Google dork 'site:target.com filetype:sql' would search for SQL files on the specified target domain. The 'filetype:' operator specifically looks for files with the given extension."
    },
    {
        question: "What Nmap option would you use to determine the operating system of a target?",
        options: [
            "-sV",
            "-sS",
            "-O",
            "-T4"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "The -O option in Nmap enables OS detection. This feature attempts to determine the operating system running on the target based on various network responses and characteristics."
    },
    {
        question: "Which tool is specifically designed for detecting WAF (Web Application Firewall) protections?",
        options: [
            "Nikto",
            "wafw00f",
            "Dirb",
            "SQLmap"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "wafw00f is a tool specifically designed to detect and identify Web Application Firewall (WAF) products protecting a website. It sends specific requests and analyzes the responses to determine if a WAF is present and what type it might be."
    },
    {
        question: "What is the correct command to use Sublist3r for subdomain enumeration with Virustotal as a source?",
        options: [
            "sublist3r -d example.com -e virustotal",
            "sublist3r -domain example.com -engines virustotal",
            "sublist3r --domain example.com --source virustotal",
            "sublist3r -d example.com -s virustotal"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "The correct command is 'sublist3r -d example.com -e virustotal' where -d specifies the domain and -e specifies the search engine to use for subdomain enumeration (virustotal in this case)."
    },
    {
        question: "What is the purpose of the 'whois' command?",
        options: [
            "To scan for open ports on a target server",
            "To perform DNS zone transfers",
            "To query domain registration information and ownership details",
            "To map network topology"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "The 'whois' command is used to query databases for domain registration information including owner details, registrar information, creation and expiration dates, name servers, and other administrative information about a domain."
    },
    {
        question: "Which of the following commands would display all DNS records for a domain?",
        options: [
            "dig example.com all",
            "dig example.com any",
            "nslookup -q=any example.com",
            "host -a example.com"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The command 'dig example.com any' queries for all DNS record types for the specified domain. The 'any' query type is a wildcard that requests all available record types for the domain."
    },
    {
        question: "What DNS record type would provide information about which mail servers accept email for a domain?",
        options: [
            "A record",
            "MX record",
            "CNAME record",
            "TXT record"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "MX (Mail Exchange) records specify the mail servers responsible for accepting email on behalf of a domain. These records include a priority value to determine which mail server should be used if multiple servers are available."
    },
    {
        question: "What is the most common port used for HTTPS traffic?",
        options: [
            "Port 21",
            "Port 80",
            "Port 443",
            "Port 8080"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Port 443 is the standard port used for HTTPS (HTTP Secure) traffic. This port is used for secure web communication encrypted with SSL/TLS protocols."
    },
    {
        question: "Which Nmap option would you use to scan all 65535 ports on a target?",
        options: [
            "-p 1-65535",
            "-p-",
            "-p all",
            "-p full"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The Nmap option '-p-' is a shorthand way to scan all 65535 ports on a target. It's equivalent to '-p 1-65535' but more convenient to type."
    },
    {
        question: "What is the command to check if a specific host is vulnerable to a DNS zone transfer?",
        options: [
            "nmap --script=dns-zone-transfer -p 53 ns.example.com",
            "dig axfr @ns.example.com example.com",
            "host -t axfr example.com ns.example.com",
            "dnsenum --axfr example.com"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The command 'dig axfr @ns.example.com example.com' attempts to perform a zone transfer (AXFR) for example.com from the nameserver ns.example.com. This will show if the nameserver is misconfigured to allow zone transfers to unauthorized users."
    },
    {
        question: "Which Google dork would help find login pages on a specific website?",
        options: [
            "site:example.com intext:password",
            "site:example.com inurl:login",
            "site:example.com filetype:php",
            "site:example.com intitle:admin"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The Google dork 'site:example.com inurl:login' searches for pages within the specified domain that have 'login' in their URL, which typically indicates authentication pages."
    },
    {
        question: "What does the '-p-' parameter do in an Nmap scan?",
        options: [
            "Performs a ping scan only",
            "Scans all 65535 ports",
            "Performs a passive scan without sending packets",
            "Increases the scan performance"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The '-p-' parameter in Nmap scans all 65535 ports on the target. It's a shorthand way to specify the port range 1-65535 without typing the full range."
    },
    {
        question: "Which tool would you use to search for email addresses associated with a domain?",
        options: [
            "dirb",
            "nmap",
            "theHarvester",
            "sqlmap"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "theHarvester is a tool specifically designed for gathering emails, subdomains, hosts, employee names, open ports, and banners from different public sources like search engines, PGP key servers, and SHODAN computer database."
    },
    {
        question: "What option would you add to an Nmap scan to detect service versions?",
        options: [
            "-sV",
            "-O",
            "-A",
            "-T4"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "The -sV option in Nmap enables version detection, which attempts to determine the service protocol, application name, and version number running on open ports."
    },
    {
        question: "Which tool is designed specifically for subdomain enumeration during information gathering?",
        options: [
            "Metasploit",
            "Sublist3r",
            "Burp Suite",
            "SQLmap"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Sublist3r is a Python tool designed specifically for enumerating subdomains using various search engines like Google, Yahoo, Bing, Baidu, and Ask, as well as services like Netcraft, DNSdumpster, and Virustotal. It helps penetration testers gather subdomains for their target domains."
    },
    {
        question: "Which of the following is NOT a common source used by theHarvester for email gathering?",
        options: [
            "Google",
            "LinkedIn",
            "Nmap",
            "Bing"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Nmap is not a source used by theHarvester for email gathering. Nmap is a network scanning tool, not a search engine or public database. theHarvester typically uses sources like Google, Bing, LinkedIn, Twitter, and other search engines or public databases to collect information."
    },
    {
        question: "What is the default DNS server port that would be targeted during a zone transfer attempt?",
        options: [
            "Port 21",
            "Port 25",
            "Port 53",
            "Port 80"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Port 53 is the default DNS server port that would be targeted during a zone transfer attempt. DNS zone transfers typically use TCP port 53, while standard DNS queries use UDP port 53."
    },
    {
        question: "Which command would show all the mail servers for a domain?",
        options: [
            "dig example.com MX",
            "nslookup -type=mx example.com",
            "host -t mx example.com",
            "All of the above"
        ],
        correctAnswer: 3,
        chapter: "Information Gathering",
        explanation: "All of the provided commands can be used to query for the MX (Mail Exchange) records of a domain. 'dig example.com MX', 'nslookup -type=mx example.com', and 'host -t mx example.com' are all valid ways to find mail servers for a domain."
    },
    {
        question: "Which of the following is NOT a passive information gathering technique?",
        options: [
            "Using Whois to look up domain registration",
            "Checking for leaked password databases",
            "Running Nmap port scans on the target",
            "Using Google dorks to find sensitive information"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Running Nmap port scans on the target is not a passive information gathering technique; it's an active technique because it involves directly interacting with the target systems by sending packets. The other options are passive because they don't involve direct interaction with the target."
    },
    {
        question: "What command would you use to find the IP address of a domain name?",
        options: [
            "whois domain.com",
            "ping domain.com",
            "traceroute domain.com",
            "nslookup domain.com"
        ],
        correctAnswer: 3,
        chapter: "Information Gathering",
        explanation: "The 'nslookup domain.com' command is used to query DNS to find the IP address associated with a domain name. While 'ping domain.com' also shows the IP address, its primary purpose is to test connectivity, not DNS resolution."
    },
    {
        question: "Which Nmap command would perform a fast scan of the top 100 ports?",
        options: [
            "nmap -F target.com",
            "nmap -p 1-100 target.com",
            "nmap --top-ports 100 target.com",
            "nmap -sT -p top100 target.com"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "The 'nmap -F target.com' command performs a fast scan by checking only the top 100 most common ports instead of the default 1000 ports."
    },
    {
        question: "What is the main difference between active and passive information gathering?",
        options: [
            "Active gathering is legal, passive is illegal",
            "Active gathering involves directly interacting with the target, passive does not",
            "Active gathering takes longer than passive gathering",
            "Active gathering only works on websites, passive works on all systems"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The main difference between active and passive information gathering is that active gathering involves directly interacting with the target (sending packets, making connections, etc.), while passive gathering collects information without any direct interaction with the target systems."
    },
    {
        question: "Which of these would be considered an active information gathering technique?",
        options: [
            "Browsing a company's public website",
            "Checking social media profiles of employees",
            "Scanning network ports with Nmap",
            "Reading news articles about a company"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Scanning network ports with Nmap is considered an active information gathering technique because it involves directly sending packets to the target system and analyzing the responses. The other options do not involve direct interaction with the target's systems."
    },
    {
        question: "Which command line tool is commonly used to identify the web server technology behind a website?",
        options: [
            "curl",
            "wget",
            "whatweb",
            "dirb"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Whatweb is a command-line tool specifically designed to identify web technologies including content management systems (CMS), blogging platforms, statistic/analytics packages, JavaScript libraries, web servers, and embedded devices. It can identify version numbers, email addresses, account IDs, web framework modules, and more."
    },
    {
        question: "What Cloudflare public DNS server IP address is commonly used?",
        options: [
            "8.8.8.8",
            "1.1.1.1",
            "9.9.9.9",
            "208.67.222.222"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "1.1.1.1 is Cloudflare's public DNS server IP address. It's designed to be easy to remember and provides a fast, privacy-focused DNS resolution service."
    },
    {
        question: "What is Google's primary public DNS server IP address?",
        options: [
            "1.1.1.1",
            "8.8.8.8",
            "9.9.9.9",
            "4.4.4.4"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "8.8.8.8 is Google's primary public DNS server IP address. It's widely used and easily remembered, with 8.8.4.4 being Google's secondary DNS server."
    },
    {
        question: "Which command would you use to extract metadata from PDF documents during information gathering?",
        options: [
            "pdf-parser",
            "exiftool",
            "strings",
            "grep"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "exiftool is a powerful command-line application for reading, writing, and manipulating metadata in various file types, including PDFs. During information gathering, it can reveal valuable information like author names, creation dates, software used, and sometimes even sensitive information inadvertently left in document metadata."
    },
    {
        question: "What type of DNS record maps a hostname to an IPv6 address?",
        options: [
            "A record",
            "AAAA record",
            "CNAME record",
            "MX record"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The AAAA record (quad-A record) is used to map a hostname or domain to an IPv6 address. This is equivalent to the A record which maps to IPv4 addresses."
    },
    {
        question: "Which Nmap timing template offers the fastest scanning speed?",
        options: [
            "-T1",
            "-T3",
            "-T4",
            "-T5"
        ],
        correctAnswer: 3,
        chapter: "Information Gathering",
        explanation: "The -T5 timing template in Nmap offers the fastest scanning speed. The timing templates range from -T0 (paranoid) to -T5 (insane), with each higher level being more aggressive and potentially more detectable."
    },
    {
        question: "What option would you add to an Nmap scan to perform a comprehensive scan including OS detection, version detection, script scanning, and traceroute?",
        options: [
            "-sS",
            "-A",
            "-T4",
            "-p-"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The -A option in Nmap enables aggressive scanning, which includes OS detection (-O), version scanning (-sV), script scanning (--script=default), and traceroute (--traceroute). It's a convenient way to run a comprehensive scan with a single option."
    },
    {
        question: "Which tool can be used to check if an email address was included in known data breaches?",
        options: [
            "theHarvester",
            "Maltego",
            "Have I Been Pwned",
            "Shodan"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Have I Been Pwned is a service that allows you to check if email addresses or passwords have been compromised in known data breaches. This can be a valuable source of information during passive reconnaissance to determine if organization credentials have been leaked."
    },
    {
        question: "What is the purpose of a 'robots.txt' file on a website and why is it valuable for information gathering?",
        options: [
            "To provide contact information for website administrators",
            "To instruct search engine crawlers about which parts of the site should not be indexed",
            "To list all the technologies used on the website",
            "To declare the website's privacy policy"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "A 'robots.txt' file is used to instruct search engine crawlers about which parts of the website should not be indexed. This is valuable for information gathering because it often reveals sensitive directories and files that the administrator doesn't want publicly indexed, providing potential targets for further investigation."
    },
    {
        question: "Which command-line tool is specifically designed for discovering web content like hidden directories and files on a website?",
        options: [
            "nmap",
            "theHarvester",
            "dirb",
            "netcat"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Dirb is a command-line tool specifically designed for discovering web content by brute-forcing directories and files on a website using dictionary-based attacks. It helps find hidden directories, administrative panels, backup files, and other sensitive resources that might not be linked from the main website."
    },
    {
        question: "What is the standard port used for FTP services?",
        options: [
            "Port 21",
            "Port 22",
            "Port 23",
            "Port 25"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "Port 21 is the standard port used for FTP (File Transfer Protocol) services. Specifically, port 21 is used for the FTP control channel, while port 20 is traditionally used for the data channel in active mode FTP."
    },
    {
        question: "What is the standard port used for SSH services?",
        options: [
            "Port 21",
            "Port 22",
            "Port 23",
            "Port 25"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Port 22 is the standard port used for SSH (Secure Shell) services, which provide a secure encrypted channel for remote login and other network services."
    },
    {
        question: "What command would you use to find all subdomains of a domain using DNS brute forcing?",
        options: [
            "dnsmap example.com",
            "dnsenum example.com",
            "Both A and B",
            "Neither A nor B"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "Both dnsmap and dnsenum are tools that can be used to find subdomains of a domain using DNS brute forcing techniques. They work by trying a list of common subdomain names and checking if they resolve to IP addresses."
    },
    {
        question: "What is the purpose of the 'curl -I' command in information gathering?",
        options: [
            "To download a web page",
            "To view the HTML source code",
            "To show only the HTTP headers of a response",
            "To request the server identity"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "The 'curl -I' command (or curl --head) shows only the HTTP headers of a response without downloading the body content. This is useful in information gathering to identify web server types, versions, and configured headers without downloading the entire page."
    },
    {
        question: "Which of the following is NOT a common DNS record type used in information gathering?",
        options: [
            "A",
            "MX",
            "HTTP",
            "TXT"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "HTTP is not a DNS record type. The common DNS record types used in information gathering include A (IPv4 address), AAAA (IPv6 address), MX (mail server), NS (nameserver), CNAME (alias), TXT (text), and SOA (start of authority)."
    },
    {
        question: "What does the command 'host -t NS example.com' do?",
        options: [
            "Lists all hosts in the example.com network",
            "Displays the IP address of example.com",
            "Shows the nameservers for example.com",
            "Tests if example.com is a nameserver"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "The command 'host -t NS example.com' queries for the NS (nameserver) records of the domain example.com, showing which nameservers are authoritative for that domain."
    },
    {
        question: "Which tool would you use to check for misconfigured CORS (Cross-Origin Resource Sharing) settings during information gathering?",
        options: [
            "corscanner",
            "corstest",
            "cURL",
            "All of the above"
        ],
        correctAnswer: 3,
        chapter: "Information Gathering",
        explanation: "All of these tools can be used to check for misconfigured CORS settings. Dedicated tools like corscanner and corstest are designed specifically for CORS testing, while cURL can be used with appropriate headers to test CORS configurations manually."
    },
    {
        question: "What does the '-h' parameter typically do in command-line tools?",
        options: [
            "Enables hacking mode",
            "Shows the help menu",
            "Hides the command output",
            "Applies heavy processing"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "In most command-line tools, the '-h' parameter (or '--help') displays the help menu, showing the available command options, syntax, and basic usage examples. This is useful when learning how to use new tools for information gathering."
    },
    {
        question: "Which command would reveal the path that network packets take to reach a target?",
        options: [
            "ping",
            "netstat",
            "traceroute",
            "route"
        ],
        correctAnswer: 2,
        chapter: "Information Gathering",
        explanation: "The traceroute command (or tracert in Windows) shows the path that network packets take to reach a destination, displaying each hop along the route and the time it takes to reach each hop. This is useful for network mapping and understanding the network topology between you and a target."
    },
    {
        question: "What is the standard port used for SMTP (email) services?",
        options: [
            "Port 21",
            "Port 25",
            "Port 110",
            "Port 143"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Port 25 is the standard port used for SMTP (Simple Mail Transfer Protocol) services, which is used for sending emails between mail servers. During information gathering, open SMTP ports might reveal email servers that could be targeted or used for further intelligence gathering."
    },
    {
        question: "Which website footprinting tool provides historical information about websites, including previous versions and technologies used?",
        options: [
            "Shodan",
            "Wayback Machine",
            "Netcraft",
            "Censys"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The Wayback Machine (archive.org) provides historical snapshots of websites, allowing penetration testers to access previous versions of a website that might contain sensitive information that has since been removed or to observe the evolution of the site's security measures over time."
    },
    {
        question: "What social engineering technique involves calling a help desk or support line while pretending to be an authorized user to gather information?",
        options: [
            "Phishing",
            "Vishing",
            "Pretexting",
            "Baiting"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "Vishing (voice phishing) is a social engineering technique that involves making phone calls to targets like help desks or support lines while pretending to be an authorized user or someone in authority to trick them into revealing sensitive information or performing actions that aid the attacker."
    },
    {
        question: "What technique involves gathering information from an organization's discarded materials such as printouts, sticky notes, or storage devices?",
        options: [
            "Dumpster diving",
            "Social engineering",
            "Shoulder surfing",
            "OSINT gathering"
        ],
        correctAnswer: 0,
        chapter: "Information Gathering",
        explanation: "Dumpster diving involves searching through an organization's trash to find information that could be valuable for penetration testing, such as printed documents with passwords, organizational charts, technical specifications, or even discarded storage media that might contain sensitive data."
    },
    {
        question: "What is the purpose of using the '--script vulners' option with Nmap?",
        options: [
            "To perform OS fingerprinting",
            "To check for known vulnerabilities in detected services",
            "To generate a vulnerability report",
            "To exploit vulnerable services"
        ],
        correctAnswer: 1,
        chapter: "Information Gathering",
        explanation: "The '--script vulners' option with Nmap uses the vulners script to check detected services and their versions against a database of known vulnerabilities (CVEs). This helps identify potentially vulnerable services during the information gathering phase of a penetration test."
    }
];