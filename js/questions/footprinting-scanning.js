/**
 * Questions for the Footprinting & Scanning chapter
 */
quizDataByChapter.footprintingScanning = [
    {
        question: "What is active information gathering in the context of penetration testing?",
        options: [
            "Gathering information without directly interacting with the target",
            "Gathering information by directly interacting with the target system or network",
            "Gathering information from public sources only",
            "Gathering information using social engineering techniques"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "Active information gathering refers to the phase of the assessment where the tester actively interacts with the target system or network to collect data and identify potential vulnerabilities. This phase involves techniques that go beyond passive reconnaissance and may include activities such as scanning, probing, and direct interaction with network services."
    },
    {
        question: "Which layer of the OSI model is responsible for logical addressing and routing?",
        options: [
            "Data Link Layer (Layer 2)",
            "Network Layer (Layer 3)",
            "Transport Layer (Layer 4)",
            "Session Layer (Layer 5)"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The Network Layer (Layer 3) of the OSI model is responsible for logical addressing, routing, and forwarding data packets between devices across different networks. Its primary goal is to determine the optimal path for data to travel from the source to the destination, even if the devices are on separate networks."
    },
    {
        question: "What is the main difference between TCP and UDP?",
        options: [
            "TCP is faster but less reliable, UDP is slower but more reliable",
            "TCP uses smaller header size, UDP uses larger header size",
            "TCP is connection-oriented and reliable, UDP is connectionless and unreliable",
            "TCP works at the Network layer, UDP works at the Transport layer"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "TCP (Transmission Control Protocol) is a connection-oriented protocol that establishes a connection before data transfer and ensures reliable, ordered delivery through acknowledgments and retransmission of lost packets. UDP (User Datagram Protocol) is connectionless and does not guarantee delivery or order of packets, making it faster but less reliable."
    },
    {
        question: "What is the purpose of the TCP three-way handshake?",
        options: [
            "To authenticate the client and server",
            "To establish a reliable connection between two devices",
            "To terminate a connection between two devices",
            "To encrypt data between the client and server"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The TCP three-way handshake is a process used to establish a reliable connection between two devices before they begin data transmission. It involves a series of three messages exchanged between the sender (client) and the receiver (server): SYN, SYN-ACK, and ACK."
    },
    {
        question: "Which ICMP message type is used for echo request (ping)?",
        options: [
            "Type 0",
            "Type 3",
            "Type 5",
            "Type 8"
        ],
        correctAnswer: 3,
        chapter: "Footprinting & Scanning",
        explanation: "ICMP Type 8 is used for echo request (ping). When a ping command is issued, an ICMP Echo Request (Type 8, Code 0) packet is sent to the target host. If the host is reachable, it responds with an ICMP Echo Reply (Type 0, Code 0) packet."
    },
    {
        question: "What is a ping sweep?",
        options: [
            "A technique to bypass firewall restrictions",
            "A network scanning technique to discover live hosts within an IP address range",
            "A method to detect the operating system of a target",
            "A technique to scan all open ports on a target"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "A ping sweep is a network scanning technique used to discover live hosts (computers, servers, or other devices) within a specific IP address range on a network. The basic idea is to send a series of ICMP Echo Request (ping) messages to a range of IP addresses and observe the responses to determine which addresses are active or reachable."
    },
    {
        question: "What is the primary purpose of Nmap?",
        options: [
            "To crack passwords on target systems",
            "To exploit vulnerabilities in target systems",
            "To discover hosts and services on a network",
            "To monitor network traffic in real-time"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "Nmap (Network Mapper) is an open-source network scanning tool used for discovering hosts and services on a computer network, finding open ports, and identifying potential vulnerabilities. It's a powerful tool for network exploration and security auditing."
    },
    {
        question: "Which Nmap scan type uses a complete TCP three-way handshake?",
        options: [
            "SYN scan (-sS)",
            "Connect scan (-sT)",
            "ACK scan (-sA)",
            "FIN scan (-sF)"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The Connect scan (-sT) in Nmap uses a complete TCP three-way handshake to establish a full connection with the target port. This is unlike the SYN scan which only sends a SYN packet and doesn't complete the handshake."
    },
    {
        question: "What is the purpose of the TTL (Time-to-Live) field in an IP packet?",
        options: [
            "To specify the time a packet can remain in the network before being discarded",
            "To indicate the total size of the IP packet",
            "To identify the protocol that will receive the packet after IP processing",
            "To track the time it takes for a packet to reach its destination"
        ],
        correctAnswer: 0,
        chapter: "Footprinting & Scanning",
        explanation: "The Time-to-Live (TTL) field in an IP packet is an 8-bit value that represents the maximum number of hops (routers) a packet can traverse before being discarded. It is decremented by one at each hop, preventing packets from circulating indefinitely in the network in case of routing loops."
    },
    {
        question: "Which port range is reserved for well-known services according to IANA?",
        options: [
            "0-1023",
            "1024-49151",
            "49152-65535",
            "0-65535"
        ],
        correctAnswer: 0,
        chapter: "Footprinting & Scanning",
        explanation: "Well-Known Ports (0-1023) are port numbers reserved for well-known services and protocols. These are standardized by the Internet Assigned Numbers Authority (IANA). Examples include port 80 for HTTP, port 443 for HTTPS, port 22 for SSH, etc."
    },
    {
        question: "What is OS fingerprinting in the context of network scanning?",
        options: [
            "Creating a backup of the target's operating system",
            "Identifying the target's operating system based on network responses",
            "Copying the target's operating system files",
            "Installing keyloggers on the target's operating system"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "OS fingerprinting (or OS detection) is the process of identifying the operating system of a remote host based on the characteristics of its network responses. Nmap can attempt to determine the OS of a target by analyzing how it responds to different probe packets."
    },
    {
        question: "Which Nmap option is used for service version detection?",
        options: [
            "-sV",
            "-O",
            "-A",
            "-p"
        ],
        correctAnswer: 0,
        chapter: "Footprinting & Scanning",
        explanation: "The -sV option in Nmap is used for service version detection. It probes open ports to determine service information (protocol, application name, version). This helps in identifying potentially vulnerable services running on the target host."
    },
    {
        question: "What is the Nmap Scripting Engine (NSE)?",
        options: [
            "A tool for writing custom exploits",
            "A programming language for creating network protocols",
            "A framework that allows Nmap to automate a wide variety of networking tasks",
            "A graphic interface for Nmap"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The Nmap Scripting Engine (NSE) is a powerful feature that allows users to write and share scripts to automate a wide variety of networking tasks. NSE scripts can be used for network discovery, more sophisticated version detection, vulnerability detection, and even exploitation."
    },
    {
        question: "What does the -T parameter in Nmap control?",
        options: [
            "The target IP address",
            "The timeout value for each probe",
            "The timing template (scan speed)",
            "The type of scan to perform"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The -T parameter in Nmap controls the timing template, which affects the speed of the scan. It ranges from -T0 (paranoid) to -T5 (insane), with -T3 (normal) being the default. Higher values make the scan faster but potentially more detectable, while lower values make it stealthier but slower."
    },
    {
        question: "Which technique would be most effective for discovering hosts on a local network?",
        options: [
            "ICMP Echo Request (ping sweep)",
            "TCP SYN scan",
            "ARP scan",
            "UDP scan"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "ARP scanning is one of the most effective techniques for discovering hosts on a local network (same broadcast domain). It works by sending ARP requests to determine which IP addresses are associated with MAC addresses on the local network. It's faster and more reliable than ICMP or TCP/UDP scans for local networks."
    },
    {
        question: "What is the primary purpose of a TCP SYN scan?",
        options: [
            "To establish a full connection with the target",
            "To identify open ports on the target without completing a full TCP connection",
            "To bypass firewall restrictions",
            "To detect the operating system of the target"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The primary purpose of a TCP SYN scan (also known as half-open scan) is to identify open ports on the target without establishing a full TCP connection. It sends a SYN packet and analyzes the response—if a SYN-ACK is received, it indicates the port is open, but the scanner doesn't complete the handshake by sending the final ACK."
    },
    {
        question: "Which of the following is NOT a typical objective of network mapping in penetration testing?",
        options: [
            "Discovery of live hosts",
            "Identification of open ports and services",
            "Network topology mapping",
            "Data exfiltration from identified hosts"
        ],
        correctAnswer: 3,
        chapter: "Footprinting & Scanning",
        explanation: "Data exfiltration is not a typical objective of network mapping in penetration testing. Network mapping focuses on discovering and identifying network components, while data exfiltration involves stealing data from a system, which is an exploitation activity that would occur later in the penetration testing process and only with proper authorization."
    },
    {
        question: "What is the function of the 'header length' field in an IPv4 header?",
        options: [
            "Specifies the length of the IPv4 header in 32-bit words",
            "Represents the total size of the IP packet",
            "Specifies the maximum number of hops a packet can traverse",
            "Identifies the higher-layer protocol that will receive the packet"
        ],
        correctAnswer: 0,
        chapter: "Footprinting & Scanning",
        explanation: "The 'header length' field in an IPv4 header specifies the length of the IPv4 header in 32-bit words. The minimum value is 5, indicating a 20-byte header, and the maximum is 15, indicating a 60-byte header."
    },
    {
        question: "What is the purpose of the 'Don't Fragment' (DF) flag in an IP packet?",
        options: [
            "To indicate that more fragments follow in a fragmented packet",
            "To prevent the packet from being fragmented",
            "To specify that the packet contains encrypted data",
            "To request a higher priority routing for the packet"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The 'Don't Fragment' (DF) flag in an IP packet, when set to 1, indicates that the packet should not be fragmented. If a router needs to fragment a packet with the DF flag set but cannot do so, it will drop the packet and send an ICMP 'Fragmentation Needed and DF Set' message back to the sender."
    },
    {
        question: "Which of the following is a connectionless transport protocol?",
        options: [
            "TCP",
            "HTTP",
            "UDP",
            "FTP"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "UDP (User Datagram Protocol) is a connectionless transport protocol. It does not establish a connection before sending data and does not provide the same level of reliability and ordering guarantees as TCP. Instead, it focuses on simplicity and efficiency."
    },
    {
        question: "What is the correct sequence of the OSI model layers from bottom to top?",
        options: [
            "Physical, Data Link, Network, Transport, Session, Presentation, Application",
            "Application, Presentation, Session, Transport, Network, Data Link, Physical",
            "Network, Physical, Data Link, Transport, Session, Presentation, Application",
            "Physical, Network, Data Link, Session, Transport, Presentation, Application"
        ],
        correctAnswer: 0,
        chapter: "Footprinting & Scanning",
        explanation: "The correct sequence of the OSI model layers from bottom (Layer 1) to top (Layer 7) is: Physical, Data Link, Network, Transport, Session, Presentation, Application. A helpful mnemonic is 'Please Do Not Throw Sausage Pizza Away'."
    },
    {
        question: "Which mnemonic can help remember the OSI model layers from top to bottom?",
        options: [
            "Please Do Not Throw Sausage Pizza Away",
            "All People Seem To Need Data Processing",
            "All Pros Search Top Notch Donut Places",
            "Always Patch Systems To Nullify Dangerous Programs"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The mnemonic 'All People Seem To Need Data Processing' helps remember the OSI model layers from top (Layer 7) to bottom (Layer 1): Application, Presentation, Session, Transport, Network, Data Link, Physical."
    },
    {
        question: "Which OSI layer is responsible for encryption, compression, and data format translation?",
        options: [
            "Transport Layer (Layer 4)",
            "Session Layer (Layer 5)",
            "Presentation Layer (Layer 6)",
            "Application Layer (Layer 7)"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The Presentation Layer (Layer 6) is responsible for data format translation, encryption, and compression to ensure that data is presented in a readable format for the application layer. Examples of protocols include SSL/TLS, JPEG, GIF."
    },
    {
        question: "Which OSI layer manages sessions or connections between applications?",
        options: [
            "Network Layer (Layer 3)",
            "Transport Layer (Layer 4)",
            "Session Layer (Layer 5)",
            "Presentation Layer (Layer 6)"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The Session Layer (Layer 5) manages sessions or connections between applications. It handles synchronization, dialog control, and token management for interhost communication. Examples include APIs, NetBIOS, and RPC."
    },
    {
        question: "Which OSI layer deals with physical addressing (MAC addresses)?",
        options: [
            "Physical Layer (Layer 1)",
            "Data Link Layer (Layer 2)",
            "Network Layer (Layer 3)",
            "Transport Layer (Layer 4)"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The Data Link Layer (Layer 2) manages access to the physical medium and provides error detection. It is responsible for framing, physical addressing (MAC addresses), and error checking of data frames. Examples include Ethernet and Switches."
    },
    {
        question: "What port number is used for HTTPS connections?",
        options: [
            "21",
            "22",
            "80",
            "443"
        ],
        correctAnswer: 3,
        chapter: "Footprinting & Scanning",
        explanation: "Port 443 is the standard port used for HTTPS (HTTP Secure) connections, which is HTTP over TLS/SSL for secure web browsing."
    },
    {
        question: "Which port is commonly used for SSH (Secure Shell) connections?",
        options: [
            "21",
            "22",
            "23",
            "25"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "Port 22 is the standard port used for SSH (Secure Shell) connections, which provides secure remote login, command execution, and file transfer capabilities."
    },
    {
        question: "What port is used for FTP (File Transfer Protocol)?",
        options: [
            "20/21",
            "22",
            "23",
            "25"
        ],
        correctAnswer: 0,
        chapter: "Footprinting & Scanning",
        explanation: "FTP uses ports 20 and 21. Port 21 is used for the control connection (commands), while port 20 is used for the data connection (file transfers)."
    },
    {
        question: "Which port is used for SMTP (Simple Mail Transfer Protocol)?",
        options: [
            "25",
            "110",
            "143",
            "587"
        ],
        correctAnswer: 0,
        chapter: "Footprinting & Scanning",
        explanation: "Port 25 is the standard port used for SMTP (Simple Mail Transfer Protocol), which is used for sending emails. Note that port 587 is also used for SMTP with TLS (submission)."
    },
    {
        question: "What port is used for DNS (Domain Name System)?",
        options: [
            "22",
            "53",
            "80",
            "443"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "Port 53 is used for DNS (Domain Name System), which is responsible for translating domain names to IP addresses. It uses both TCP and UDP protocols on port 53."
    },
    {
        question: "Which Nmap command would you use to perform a stealth SYN scan on a target?",
        options: [
            "nmap -sT 192.168.1.1",
            "nmap -sS 192.168.1.1",
            "nmap -sU 192.168.1.1",
            "nmap -sA 192.168.1.1"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The command 'nmap -sS 192.168.1.1' performs a stealth SYN scan (also known as half-open scan) on the target. This scan type is relatively stealthy as it doesn't complete the TCP three-way handshake."
    },
    {
        question: "Which Nmap command would you use to detect the operating system of a target?",
        options: [
            "nmap -sV 192.168.1.1",
            "nmap -O 192.168.1.1",
            "nmap -A 192.168.1.1",
            "nmap -sS 192.168.1.1"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The command 'nmap -O 192.168.1.1' is used to detect the operating system of a target. The -O flag enables OS detection in Nmap."
    },
    {
        question: "Which Nmap scan type would be least likely to be detected by a firewall or IDS?",
        options: [
            "TCP Connect scan (-sT)",
            "TCP SYN scan (-sS)",
            "TCP NULL scan (-sN)",
            "Ping scan (-sP)"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The TCP NULL scan (-sN) is one of the stealthiest scan types as it sends TCP packets with no flags set. Many intrusion detection systems and firewalls are configured to watch for standard scan types like SYN and Connect scans, but may miss NULL scans."
    },
    {
        question: "What information is contained in the TTL field of an IP packet?",
        options: [
            "The port number to which the packet is directed",
            "The maximum number of hops a packet can traverse before being discarded",
            "The total length of the packet in bytes",
            "The protocol being used in the transport layer"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The Time-to-Live (TTL) field contains an 8-bit value that indicates the maximum number of hops (routers) a packet can traverse before being discarded. It is decremented by one at each hop to prevent packets from circulating indefinitely."
    },
    {
        question: "What is the practical purpose of using the '-T' timing option in Nmap?",
        options: [
            "To specify the ports to be scanned",
            "To adjust the timeout value for responses",
            "To control the aggressiveness and speed of the scan",
            "To set the number of retries for failed probes"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The '-T' timing option in Nmap controls the aggressiveness and speed of the scan. It ranges from -T0 (paranoid, very slow) to -T5 (insane, very fast). In practical scenarios, you might use a lower timing option (-T1 or -T2) to avoid detection in sensitive environments, or a higher timing option (-T4 or -T5) when speed is important and stealth is not a concern."
    },
    {
        question: "In a practical penetration test, why might you choose to use a TCP Connect scan instead of a SYN scan?",
        options: [
            "Because Connect scans are always faster",
            "Because Connect scans provide more accurate results",
            "Because SYN scans require root/administrator privileges, while Connect scans don't",
            "Because Connect scans can bypass firewalls more easily"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "In practical penetration testing, you might choose to use a TCP Connect scan (-sT) instead of a SYN scan (-sS) when you don't have root/administrator privileges. SYN scans require raw socket access which typically requires elevated privileges, while Connect scans use standard system calls available to regular users."
    },
    {
        question: "What does the following Nmap command do: 'nmap -p 80,443,8080 -sV 192.168.1.1'?",
        options: [
            "Scans all ports on 192.168.1.1 and attempts to determine service versions",
            "Performs a stealth scan on ports 80, 443, and 8080 of 192.168.1.1",
            "Scans ports 80, 443, and 8080 on 192.168.1.1 and attempts to determine service versions",
            "Performs an OS detection scan on ports 80, 443, and 8080 of 192.168.1.1"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The command 'nmap -p 80,443,8080 -sV 192.168.1.1' scans only the specified ports (80, 443, and 8080) on the target IP 192.168.1.1 and attempts to determine the service versions running on those ports. The -p flag specifies ports, and -sV enables service version detection."
    },
    {
        question: "What is the default Nmap scan type if no scan type option is specified?",
        options: [
            "TCP SYN scan",
            "TCP Connect scan",
            "UDP scan",
            "Comprehensive scan"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "The default Nmap scan type is TCP Connect scan (-sT) when running Nmap without root/administrator privileges. If Nmap is run with elevated privileges, the default scan type is TCP SYN scan (-sS)."
    },
    {
        question: "Which port range is commonly used for ephemeral (temporary) ports?",
        options: [
            "0-1023",
            "1024-49151",
            "49152-65535",
            "1-65535"
        ],
        correctAnswer: 2,
        chapter: "Footprinting & Scanning",
        explanation: "The port range 49152-65535 is commonly used for ephemeral (temporary) ports. These are dynamic or private ports that are typically used by client applications when initiating connections to servers. They are not registered with IANA and can be used freely by applications."
    },
    {
        question: "What is the default port for Remote Desktop Protocol (RDP)?",
        options: [
            "22",
            "23",
            "3306",
            "3389"
        ],
        correctAnswer: 3,
        chapter: "Footprinting & Scanning",
        explanation: "The default port for Remote Desktop Protocol (RDP) is 3389. RDP is a proprietary protocol developed by Microsoft that provides a user with a graphical interface to connect to another computer over a network connection."
    },
    {
        question: "What port is used for MySQL database connections?",
        options: [
            "1433",
            "3306",
            "5432",
            "27017"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "Port 3306 is the default port used for MySQL database connections. MySQL is an open-source relational database management system."
    },
    {
        question: "In which practical scenario would you use the '-sU' option in Nmap?",
        options: [
            "When you want to perform a fast scan of only the most common ports",
            "When you need to scan for services that typically use UDP rather than TCP",
            "When you want to bypass firewall restrictions",
            "When you need to perform a stealthy scan"
        ],
        correctAnswer: 1,
        chapter: "Footprinting & Scanning",
        explanation: "You would use the '-sU' option in Nmap when you need to scan for services that typically use UDP rather than TCP. Many important services use UDP, such as DNS (53), SNMP (161/162), and DHCP (67/68). UDP scanning is important for a comprehensive security assessment, as these services might have vulnerabilities that would be missed by TCP-only scans."
    }
];