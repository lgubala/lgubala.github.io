/**
 * Questions for the Enumerations chapter
 */
quizDataByChapter.enumerations = [
    {
        "question": "What is the primary goal of service enumeration in penetration testing?",
        "options": [
        "To gather detailed information about hosts and services on a network",
        "To exploit vulnerabilities in target systems",
        "To perform denial of service attacks",
        "To deploy malware on target systems"
        ],
        "correctAnswer": 0,
        "explanation": "The goal of service enumeration is to gather additional, more specific/detailed information about the hosts/systems on a network and the services running on said hosts.",
        "chapter": "Enumerations"
        },
        {
        "question": "Which phase of a penetration test typically follows host discovery and port scanning?",
        "options": [
        "Service Enumeration",
        "Exploitation",
        "Post-Exploitation",
        "Reporting"
        ],
        "correctAnswer": 0,
        "explanation": "After the host discovery and port scanning phase of a penetration test, the next logical phase is going to involve service enumeration.",
        "chapter": "Enumerations"
        },
        {
        "question": "What information can be gathered during the enumeration phase?",
        "options": [
        "Account names, shares, and misconfigured services",
        "Only open ports and IP addresses",
        "Only operating system version information",
        "Only user password hashes"
        ],
        "correctAnswer": 0,
        "explanation": "Enumeration includes gathering information like account names, shares, misconfigured services and similar detailed information about target systems.",
        "chapter": "Enumerations"
        },
        {
        "question": "What type of connections does enumeration involve?",
        "options": [
        "Active connections to remote devices",
        "Only passive monitoring of network traffic",
        "Only encrypted connections",
        "No connections at all, just local analysis"
        ],
        "correctAnswer": 0,
        "explanation": "Like the scanning phase, enumeration involves active connections to the remote devices in the network.",
        "chapter": "Enumerations"
        },
        {
        "question": "Which of the following is a free and open-source network scanner that can discover hosts and scan for open ports?",
        "options": [
        "Nmap",
        "Wireshark",
        "Metasploit Framework",
        "Burp Suite"
        ],
        "correctAnswer": 0,
        "explanation": "Nmap is a free and open-source network scanner that can be used to discover hosts on a network as well as scan targets for open ports.",
        "chapter": "Enumerations"
        },
        {
        "question": "What can Nmap be used to enumerate besides open ports?",
        "options": [
        "Services running on open ports and operating systems",
        "Only IP addresses",
        "Only MAC addresses",
        "Only routing information"
        ],
        "correctAnswer": 0,
        "explanation": "Nmap can also be used to enumerate the services running on open ports as well as the operating system running on the target system.",
        "chapter": "Enumerations"
        },
        {
        "question": "What does NSE stand for in the context of Nmap?",
        "options": [
        "Nmap Scripting Engine",
        "Network Security Evaluator",
        "Network Service Enumerator",
        "New Script Environment"
        ],
        "correctAnswer": 0,
        "explanation": "NSE stands for Nmap Scripting Engine, as mentioned in the course overview which lists 'The Nmap Scripting Engine (NSE)' as one of the topics.",
        "chapter": "Enumerations"
        },
        {
        "question": "What format can Nmap scan results be output to for further analysis?",
        "options": [
        "A format that can be imported into MSF",
        "Only text format",
        "Only HTML format",
        "Only XML format"
        ],
        "correctAnswer": 0,
        "explanation": "We can output the results of our Nmap scan in to a format that can be imported into MSF (Metasploit Framework) for vulnerability detection and exploitation.",
        "chapter": "Enumerations"
        },
        {
        "question": "What are auxiliary modules used for in penetration testing?",
        "options": [
        "Scanning, discovery, and fuzzing",
        "Only exploitation",
        "Only post-exploitation",
        "Only reporting"
        ],
        "correctAnswer": 0,
        "explanation": "Auxiliary modules are used to perform functionality like scanning, discovery and fuzzing.",
        "chapter": "Enumerations"
        },
        {
        "question": "What types of port scanning can auxiliary modules perform?",
        "options": [
        "Both TCP & UDP port scanning",
        "Only TCP port scanning",
        "Only UDP port scanning",
        "Neither TCP nor UDP port scanning"
        ],
        "correctAnswer": 0,
        "explanation": "We can use auxiliary modules to perform both TCP & UDP port scanning as well as enumerating information from services like FTP, SSH, HTTP etc.",
        "chapter": "Enumerations"
        },
        {
        "question": "During which phases of a penetration test can auxiliary modules be used?",
        "options": [
        "Both information gathering and post exploitation phases",
        "Only information gathering phase",
        "Only exploitation phase",
        "Only post exploitation phase"
        ],
        "correctAnswer": 0,
        "explanation": "Auxiliary modules can be used during the information gathering phase of a penetration test as well as the post exploitation phase.",
        "chapter": "Enumerations"
        },
        {
        "question": "What port does FTP (File Transfer Protocol) typically use?",
        "options": [
        "TCP port 21",
        "TCP port 22",
        "TCP port 23",
        "TCP port 25"
        ],
        "correctAnswer": 0,
        "explanation": "FTP (File Transfer Protocol) is a protocol that uses TCP port 21 and is used to facilitate file sharing between a server and client/clients.",
        "chapter": "Enumerations"
        },
        {
        "question": "What is a common security issue with FTP servers?",
        "options": [
        "Anonymous login may be enabled",
        "FTP always transmits data in plaintext",
        "FTP cannot be secured with encryption",
        "FTP cannot be configured with user accounts"
        ],
        "correctAnswer": 0,
        "explanation": "FTP authentication utilizes a username and password combination, however, in some cases an improperly configured FTP server can be logged into anonymously.",
        "chapter": "Enumerations"
        },
        {
        "question": "What is SMB used for?",
        "options": [
        "Sharing files and peripherals between computers on a local network",
        "Transferring email between servers",
        "Remote administration of servers",
        "Web browsing"
        ],
        "correctAnswer": 0,
        "explanation": "SMB (Server Message Block) is a network file sharing protocol that is used to facilitate the sharing of files and peripherals between computers on a local network (LAN).",
        "chapter": "Enumerations"
        },
        {
        "question": "What port does SMB use in modern implementations?",
        "options": [
        "TCP port 445",
        "TCP port 139 only",
        "TCP port 80",
        "TCP port 22"
        ],
        "correctAnswer": 0,
        "explanation": "SMB uses port 445 (TCP). However, originally, SMB ran on top of NetBIOS using port 139.",
        "chapter": "Enumerations"
        },
        {
        "question": "What is the Linux implementation of SMB called?",
        "options": [
        "SAMBA",
        "LSMB",
        "OpenSMB",
        "UNIX-SMB"
        ],
        "correctAnswer": 0,
        "explanation": "SAMBA is the Linux implementation of SMB, and allows Windows systems to access Linux shares and devices.",
        "chapter": "Enumerations"
        },
        {
        "question": "What information can be enumerated from an SMB service?",
        "options": [
        "SMB version, shares, users",
        "Only shares",
        "Only users",
        "Only SMB version"
        ],
        "correctAnswer": 0,
        "explanation": "We can utilize auxiliary modules to enumerate the SMB version, shares, users and perform a brute-force attack in order to identify users and passwords.",
        "chapter": "Enumerations"
        },
        {
        "question": "What protocol is used by web servers to communicate with clients?",
        "options": [
        "HTTP (Hypertext Transfer Protocol)",
        "FTP (File Transfer Protocol)",
        "SMTP (Simple Mail Transfer Protocol)",
        "SSH (Secure Shell)"
        ],
        "correctAnswer": 0,
        "explanation": "Web servers utilize HTTP (Hypertext Transfer Protocol) to facilitate the communication between clients and the web server.",
        "chapter": "Enumerations"
        },
        {
        "question": "What port does HTTP typically use?",
        "options": [
        "TCP port 80",
        "TCP port 21",
        "TCP port 22",
        "TCP port 25"
        ],
        "correctAnswer": 0,
        "explanation": "HTTP is an application layer protocol that utilizes TCP port 80 for communication.",
        "chapter": "Enumerations"
        },
        {
        "question": "Which of the following is NOT a popular web server?",
        "options": [
        "SMB Server",
        "Apache",
        "Nginx",
        "Microsoft IIS"
        ],
        "correctAnswer": 0,
        "explanation": "Examples of popular web servers are Apache, Nginx and Microsoft IIS. SMB is not a web server but a file sharing protocol.",
        "chapter": "Enumerations"
        },
        {
        "question": "What default port does MySQL typically use?",
        "options": [
        "TCP port 3306",
        "TCP port 1433",
        "TCP port 5432",
        "TCP port 27017"
        ],
        "correctAnswer": 0,
        "explanation": "MySQL utilizes TCP port 3306 by default, however, like any service it can be hosted on any open TCP port.",
        "chapter": "Enumerations"
        },
        {
        "question": "What is MySQL primarily used for?",
        "options": [
        "Storing records, customer data, and web application data",
        "Sharing files between computers",
        "Remote administration of servers",
        "Email transmission"
        ],
        "correctAnswer": 0,
        "explanation": "MySQL is typically used to store records, customer data, and is most commonly deployed to store web application data.",
        "chapter": "Enumerations"
        },
        {
        "question": "What does SSH stand for?",
        "options": [
        "Secure Shell",
        "Secure Socket Host",
        "Server Security Handler",
        "System Shell Host"
        ],
        "correctAnswer": 0,
        "explanation": "SSH (Secure Shell) is a remote administration protocol that offers encryption and is the successor to Telnet.",
        "chapter": "Enumerations"
        },
        {
        "question": "What is the primary purpose of SSH?",
        "options": [
        "Remote access to servers and systems",
        "File sharing between computers",
        "Web browsing",
        "Email transmission"
        ],
        "correctAnswer": 0,
        "explanation": "SSH is typically used for remote access to servers and systems.",
        "chapter": "Enumerations"
        },
        {
        "question": "What default port does SSH use?",
        "options": [
        "TCP port 22",
        "TCP port 21",
        "TCP port 23",
        "TCP port 25"
        ],
        "correctAnswer": 0,
        "explanation": "SSH uses TCP port 22 by default, however, like other services, it can be configured to use any other open TCP port.",
        "chapter": "Enumerations"
        },
        {
        "question": "What protocol is used for email transmission?",
        "options": [
        "SMTP (Simple Mail Transfer Protocol)",
        "HTTP (Hypertext Transfer Protocol)",
        "FTP (File Transfer Protocol)",
        "SSH (Secure Shell)"
        ],
        "correctAnswer": 0,
        "explanation": "SMTP (Simple Mail Transfer Protocol) is a communication protocol that is used for the transmission of email.",
        "chapter": "Enumerations"
        },
        {
        "question": "What default port does SMTP use?",
        "options": [
        "TCP port 25",
        "TCP port 21",
        "TCP port 22",
        "TCP port 80"
        ],
        "correctAnswer": 0,
        "explanation": "SMTP uses TCP port 25 by default. It is can also be configured to run on TCP port 465 and 587.",
        "chapter": "Enumerations"
        },
        {
        "question": "What information can be enumerated from an SMTP service?",
        "options": [
        "SMTP version and user accounts",
        "Only SMTP version",
        "Only user accounts",
        "Neither SMTP version nor user accounts"
        ],
        "correctAnswer": 0,
        "explanation": "We can utilize auxiliary modules to enumerate the version of SMTP as well as user accounts on the target system.",
        "chapter": "Enumerations"
        },
        {
        "question": "In which phase of the penetration testing methodology does enumeration occur?",
        "options": [
        "After information gathering and before exploitation",
        "Before information gathering",
        "After exploitation",
        "After post-exploitation"
        ],
        "correctAnswer": 0,
        "explanation": "According to the penetration testing methodology diagram, enumeration occurs after information gathering and before exploitation (initial access).",
        "chapter": "Enumerations"
        },
        {
        "question": "What does the Nmap Scripting Engine (NSE) allow penetration testers to perform?",
        "options": [
        "Automated and custom tasks such as vulnerability detection and service version detection",
        "Only host discovery",
        "Only port scanning",
        "Only exploitation"
        ],
        "correctAnswer": 0,
        "explanation": "The Nmap Scripting Engine (NSE) allows testers to perform automated and custom tasks such as vulnerability detection, service version detection, and advanced reconnaissance.",
        "chapter": "Enumerations"
        },
        {
            "question": "Which protocol is commonly used for remote desktop access?",
            "options": [
                "RDP",
                "SSH",
                "Telnet",
                "VNC"
            ],
            "correctAnswer": 0,
            "explanation": "RDP (Remote Desktop Protocol) is commonly used for remote desktop access, typically running on port 3389.",
            "chapter": "Enumerations"
        },
        {
            "question": "What is the purpose of SNMP enumeration?",
            "options": [
                "To gather network device information",
                "To capture HTTP traffic",
                "To brute-force FTP credentials",
                "To detect open SMTP relays"
            ],
            "correctAnswer": 0,
            "explanation": "SNMP enumeration helps gather network device details such as IP addresses, running services, and hardware configurations.",
            "chapter": "Enumerations"
        },
        {
            "question": "Which Metasploit module can be used for SMB enumeration?",
            "options": [
                "auxiliary/scanner/smb/smb_enumshares",
                "exploit/windows/smb/ms17_010_eternalblue",
                "auxiliary/gather/enum_dns",
                "exploit/unix/ftp/proftpd_modcopy_exec"
            ],
            "correctAnswer": 0,
            "explanation": "The Metasploit module auxiliary/scanner/smb/smb_enumshares is used to enumerate SMB shares on a target.",
            "chapter": "Enumerations"
        },
        {
            "question": "What is the primary purpose of VoIP enumeration?",
            "options": [
                "To identify SIP users and extensions",
                "To perform network traffic analysis",
                "To scan for open email relays",
                "To detect website vulnerabilities"
            ],
            "correctAnswer": 0,
            "explanation": "VoIP enumeration focuses on discovering SIP (Session Initiation Protocol) users and extensions on a VoIP system.",
            "chapter": "Enumerations"
        },
        {
            "question": "Which command is used to enumerate NFS shares on a remote system?",
            "options": [
                "showmount -e [target]",
                "rpcinfo -p [target]",
                "nmap -sV [target]",
                "netstat -an"
            ],
            "correctAnswer": 0,
            "explanation": "The 'showmount -e' command lists NFS (Network File System) shares on a remote system.",
            "chapter": "Enumerations"
        },
        {
            "question": "What is the role of banner grabbing in enumeration?",
            "options": [
                "To retrieve service version and software details",
                "To capture network packets",
                "To analyze encrypted traffic",
                "To brute-force passwords"
            ],
            "correctAnswer": 0,
            "explanation": "Banner grabbing is used to retrieve software details such as versions, which can help identify vulnerabilities.",
            "chapter": "Enumerations"
        },
        {
            "question": "Which Nmap script category is best suited for enumeration tasks?",
            "options": [
                "Discovery",
                "Intrusive",
                "Vulnerability",
                "Exploit"
            ],
            "correctAnswer": 0,
            "explanation": "Nmap scripts under the 'Discovery' category are commonly used for enumeration, such as identifying users and services.",
            "chapter": "Enumerations"
        },
        {
            "question": "What is the primary focus of RPC enumeration?",
            "options": [
                "To identify available remote procedure calls and services",
                "To perform SQL injection attacks",
                "To analyze website security",
                "To encrypt network traffic"
            ],
            "correctAnswer": 0,
            "explanation": "RPC enumeration involves identifying available remote procedure calls and services that may be misconfigured or vulnerable.",
            "chapter": "Enumerations"
        },
        {
            "question": "Which enumeration technique is used to discover valid email addresses on a mail server?",
            "options": [
                "SMTP VRFY and EXPN commands",
                "IMAP LIST command",
                "POP3 RETR command",
                "HTTP TRACE method"
            ],
            "correctAnswer": 0,
            "explanation": "SMTP VRFY and EXPN commands allow enumeration of valid email addresses on a mail server.",
            "chapter": "Enumerations"
        },
        {
            "question": "What is the primary risk associated with SNMP enumeration?",
            "options": [
                "It can expose sensitive network configurations and credentials",
                "It allows attackers to brute-force passwords",
                "It causes denial-of-service attacks",
                "It encrypts all network traffic"
            ],
            "correctAnswer": 0,
            "explanation": "SNMP enumeration can expose network device configurations, user credentials, and other sensitive information.",
            "chapter": "Enumerations"
        }
];