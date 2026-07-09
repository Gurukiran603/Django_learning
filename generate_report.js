const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents
} = require('docx');
const fs = require('fs');

//  Colour palette 
const BLUE   = "1F4E79";
const LBLUE  = "2E75B6";
const HLIGHT = "D6E4F0";
const WHITE  = "FFFFFF";
const GRAY   = "F2F2F2";

//  Border helpers 
const border1 = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const allBorders = { top: border1, bottom: border1, left: border1, right: border1 };

function cell(text, w, isBold=false, shade=null){
  return new TableCell({
    borders: allBorders,
    width: { size: w, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: isBold, font:"Arial", size:20 })]
    })]
  });
}

function hcell(text, w){
  return new TableCell({
    borders: allBorders,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: LBLUE, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold:true, color:WHITE, font:"Arial", size:20 })]
    })]
  });
}

//  Paragraph helpers 
function h1(text){
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font:"Arial", size:32, bold:true, color:BLUE })],
    spacing: { before:360, after:180 },
    border: { bottom: { style:BorderStyle.SINGLE, size:6, color:LBLUE, space:1 } }
  });
}
function h2(text){
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font:"Arial", size:26, bold:true, color:LBLUE })],
    spacing: { before:240, after:120 }
  });
}
function h3(text){
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font:"Arial", size:22, bold:true, color:"2C5282" })],
    spacing: { before:180, after:80 }
  });
}
function p(text, center=false){
  return new Paragraph({
    alignment: center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, font:"Arial", size:22 })],
    spacing: { before:60, after:120 },
  });
}
function pi(text){
  return new Paragraph({
    numbering: { reference:"bullets", level:0 },
    children: [new TextRun({ text, font:"Arial", size:22 })],
    spacing: { before:40, after:40 }
  });
}
function ni(text){
  return new Paragraph({
    numbering: { reference:"numbers", level:0 },
    children: [new TextRun({ text, font:"Arial", size:22 })],
    spacing: { before:40, after:40 }
  });
}
function pb(){ return new Paragraph({ children:[new PageBreak()] }); }
function blank(){ return new Paragraph({ children:[new TextRun("")], spacing:{before:60,after:60} }); }

//  Simple 2-col table 
function twoColTable(rows){
  return new Table({
    width:{ size:9360, type:WidthType.DXA },
    columnWidths:[3120,6240],
    rows: rows.map((r,i)=>new TableRow({
      children:[
        new TableCell({ borders:allBorders, width:{size:3120,type:WidthType.DXA},
          shading:{fill: i%2===0 ? HLIGHT : GRAY, type:ShadingType.CLEAR},
          margins:{top:80,bottom:80,left:120,right:120},
          children:[new Paragraph({children:[new TextRun({text:r[0],bold:true,font:"Arial",size:20})]})]
        }),
        new TableCell({ borders:allBorders, width:{size:6240,type:WidthType.DXA},
          margins:{top:80,bottom:80,left:120,right:120},
          children:[new Paragraph({children:[new TextRun({text:r[1],font:"Arial",size:20})]})]
        })
      ]
    }))
  });
}
// Full-width section header block
function sectionBox(title) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: allBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: BLUE, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    color: WHITE,
                    font: "Arial",
                    size: 28
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
//  Module Table 
function moduleTable(rows){
  return new Table({
    width:{size:9360,type:WidthType.DXA},
    columnWidths:[2000,2400,4960],
    rows:[
      new TableRow({ children:[hcell("Module",2000),hcell("Sub-Module",2400),hcell("Description",4960)] }),
      ...rows.map((r,i)=>new TableRow({ children:[
        cell(r[0],2000,true, i%2===0?HLIGHT:GRAY),
        cell(r[1],2400,false, i%2===0?HLIGHT:GRAY),
        cell(r[2],4960,false, i%2===0?HLIGHT:GRAY)
      ]}))
    ]
  });
}

//  Model Table 
function modelTable(rows){
  return new Table({
    width:{size:9360,type:WidthType.DXA},
    columnWidths:[2200,1800,1600,3760],
    rows:[
      new TableRow({children:[hcell("Field",2200),hcell("Type",1800),hcell("Constraints",1600),hcell("Description",3760)]}),
      ...rows.map((r,i)=>new TableRow({children:[
        cell(r[0],2200,true,i%2===0?HLIGHT:GRAY),
        cell(r[1],1800,false,i%2===0?HLIGHT:GRAY),
        cell(r[2],1600,false,i%2===0?HLIGHT:GRAY),
        cell(r[3],3760,false,i%2===0?HLIGHT:GRAY)
      ]}))
    ]
  });
}

//  Build Document 
const doc = new Document({
  numbering:{
    config:[
      { reference:"bullets", levels:[{ level:0, format:LevelFormat.BULLET, text:"•",
          alignment:AlignmentType.LEFT, style:{paragraph:{indent:{left:720,hanging:360}}} }]},
      { reference:"numbers", levels:[{ level:0, format:LevelFormat.DECIMAL, text:"%1.",
          alignment:AlignmentType.LEFT, style:{paragraph:{indent:{left:720,hanging:360}}} }]}
    ]
  },
  styles:{
    default:{ document:{ run:{ font:"Arial", size:22 } } },
    paragraphStyles:[
      { id:"Heading1", name:"Heading 1", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{size:32,bold:true,font:"Arial",color:BLUE},
        paragraph:{spacing:{before:360,after:180},outlineLevel:0} },
      { id:"Heading2", name:"Heading 2", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{size:26,bold:true,font:"Arial",color:LBLUE},
        paragraph:{spacing:{before:240,after:120},outlineLevel:1} },
      { id:"Heading3", name:"Heading 3", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{size:22,bold:true,font:"Arial",color:"2C5282"},
        paragraph:{spacing:{before:180,after:80},outlineLevel:2} }
    ]
  },
  sections:[{
    properties:{
      page:{
        size:{ width:12240, height:15840 },
        margin:{ top:1440, right:1260, bottom:1440, left:1440 }
      }
    },
    headers:{
      default: new Header({
        children:[new Paragraph({
          alignment:AlignmentType.RIGHT,
          border:{ bottom:{style:BorderStyle.SINGLE,size:4,color:LBLUE,space:1} },
          children:[new TextRun({text:"ARCHIFY – Construction Management System  |  Final Year Project Report",
            font:"Arial",size:18,color:"555555"})]
        })]
      })
    },
    footers:{
      default: new Footer({
        children:[new Paragraph({
          alignment:AlignmentType.CENTER,
          border:{ top:{style:BorderStyle.SINGLE,size:4,color:LBLUE,space:1} },
          children:[
            new TextRun({text:"Page ", font:"Arial",size:18,color:"555555"}),
            new TextRun({children:[PageNumber.CURRENT],font:"Arial",size:18,color:"555555"}),
            new TextRun({text:" of ",font:"Arial",size:18,color:"555555"}),
            new TextRun({children:[PageNumber.TOTAL_PAGES],font:"Arial",size:18,color:"555555"})
          ]
        })]
      })
    },
    children:[

      // 
      // TITLE PAGE
      // 
      blank(), blank(), blank(),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"ARCHIFY", font:"Arial", size:72, bold:true, color:BLUE})],
        spacing:{before:0,after:60}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Construction Management System", font:"Arial", size:36, color:LBLUE})],
        spacing:{before:0,after:120}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        border:{ bottom:{style:BorderStyle.SINGLE,size:8,color:LBLUE,space:4} },
        children:[new TextRun({text:"", font:"Arial", size:22})],
        spacing:{before:0,after:240}
      }),
      blank(),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Final Year Project Report", font:"Arial", size:28, bold:true})],
        spacing:{before:120,after:60}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Submitted in partial fulfilment of the requirements for the award of", font:"Arial", size:22})],
        spacing:{before:60,after:60}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Bachelor of Technology in Computer Science & Engineering", font:"Arial", size:24, bold:true})],
        spacing:{before:60,after:180}
      }),
      blank(),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Submitted by", font:"Arial", size:22})],
        spacing:{before:60,after:40}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"[Student Name(s) – Replace]", font:"Arial", size:24, bold:true})],
        spacing:{before:0,after:60}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Register No: [XXXX]", font:"Arial", size:22})],
        spacing:{before:0,after:180}
      }),
      blank(),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Under the Guidance of", font:"Arial", size:22})],
        spacing:{before:60,after:40}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"[Guide Name – Replace]", font:"Arial", size:24, bold:true})],
        spacing:{before:0,after:60}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"Department of Computer Science & Engineering", font:"Arial", size:22})],
        spacing:{before:0,after:180}
      }),
      blank(),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"[College / University Name – Replace]", font:"Arial", size:26, bold:true, color:BLUE})],
        spacing:{before:60,after:40}
      }),
      new Paragraph({
        alignment:AlignmentType.CENTER,
        children:[new TextRun({text:"[City, State]  |  [Year]", font:"Arial", size:22})],
        spacing:{before:0,after:60}
      }),
      pb(),

      // 
      // CERTIFICATE
      // 
      h1("CERTIFICATE"),
      blank(),
p('This is to certify that the project entitled "ARCHIFY – Construction Management System" is a bonafide record of the work carried out by [Student Name(s)] bearing Register Number [XXXX] of [Department], [College Name], [University], in partial fulfilment of the requirements for the award of the degree of Bachelor of Technology in Computer Science & Engineering during the academic year [Year].'),      blank(),
      p("The project has been verified and found to meet all the academic requirements. The work presented in this report is original and has not been submitted in part or full for the award of any other degree or diploma at any institution."),
      blank(), blank(),
      twoColTable([
        ["Project Guide","Signature: _____________________"],
        ["","Name: [Guide Name]"],
        ["","Designation: Assistant Professor"],
        ["","Department of CSE"],
        ["Head of Department","Signature: _____________________"],
        ["","Name: [HOD Name]"],
        ["","Department of CSE, [College Name]"],
        ["Examiner","Signature: _____________________"],
        ["","Name:"],
        ["","Date:"]
      ]),
      pb(),

      // 
      // DECLARATION
      // 
      h1("DECLARATION"),
      blank(),
p('We, [Student Name(s)], students of [Department], [College Name], [University], hereby declare that the project work entitled "ARCHIFY – Construction Management System" submitted in partial fulfilment of the requirements for the award of the degree of Bachelor of Technology in Computer Science & Engineering is our original work carried out under the supervision of [Guide Name], [Designation], Department of Computer Science & Engineering.'),      blank(),
      p("We further declare that the work reported in this project has not been submitted, either in part or in full, for the award of any degree or diploma to any other institution or university. The information used from secondary sources has been duly acknowledged in the report. We take full responsibility for the work presented herein."),
      blank(), blank(),
      p("Place: ___________________"),
      p("Date: ___________________"),
      blank(),
      p("Signature(s): ___________________"),
      p("[Student Name(s)]"),
      pb(),

      // 
      // ACKNOWLEDGEMENT
      // 
      h1("ACKNOWLEDGEMENT"),
      blank(),
      p("We would like to express our deepest gratitude to [Guide Name], [Designation], Department of Computer Science & Engineering, [College Name], for the invaluable guidance, continuous encouragement, and constructive suggestions provided throughout the development of this project. His/Her expertise and constant support were instrumental in shaping the direction and quality of this work."),
      blank(),
      p("We extend our sincere thanks to [HOD Name], Head of the Department of Computer Science & Engineering, for providing the necessary infrastructure and a conducive academic environment for the project work."),
      blank(),
      p("We are grateful to the Principal, [Principal Name], [College Name], for the facilities and support extended to us during the course of this project."),
      blank(),
      p("We also thank all the faculty members of the Department of Computer Science & Engineering for their timely advice and assistance. Our heartfelt appreciation goes to our family members and friends whose unwavering moral support and encouragement helped us complete this project successfully."),
      blank(),
      p("Finally, we acknowledge the open-source community whose frameworks, libraries, and documentation formed the technical backbone of this system."),
      pb(),

      // 
      // ABSTRACT
      // 
      h1("ABSTRACT"),
      blank(),
      p("ARCHIFY is a comprehensive, web-based Construction Management System (CMS) developed using the Django framework (Python) and Django REST Framework. The system is designed to digitise and streamline every critical dimension of construction project management, from initial client consultation requests through project planning, design, execution, and final delivery. Traditional construction management relies heavily on manual record-keeping, fragmented communication channels, and paper-based documentation—practices that are error-prone, time-consuming, and difficult to scale."),
      blank(),
      p("ARCHIFY addresses these challenges by providing a unified digital platform that connects all stakeholders: clients, architects, civil engineers, contractors, workers, and administrators. The system implements role-based access control (RBAC) with six distinct user roles, ensuring that every actor in the construction process interacts with precisely the features and data relevant to their responsibilities."),
      blank(),
      p("Key modules include Project Management (with full lifecycle status tracking from Enquiry to Completion), Building Plan Management (with version control and multi-stage approval workflows), Milestone and Progress Tracking, Site Update Reporting with multimedia image support, Worker Management (with attendance marking and wage payment processing), Material Tracking, CCTV Camera Integration, Consultation Request Management, Real-Time Messaging, Portfolio Management for professionals, Notification Management, and comprehensive Activity Logging."),
      blank(),
      p("The system employs a relational PostgreSQL database with 26 carefully normalised models, RESTful API endpoints via Django REST Framework, and a server-side rendered HTML/CSS frontend. The platform offers significant advantages in transparency, collaboration, and operational efficiency over conventional systems. The implementation demonstrates advanced software engineering practices including UUID primary keys, abstract model inheritance, database indexing, and constraint-based data integrity enforcement."),
      blank(),
      new Paragraph({
        children:[new TextRun({text:"Keywords: ", bold:true, font:"Arial", size:22}),
          new TextRun({text:"Construction Management System, Django, Role-Based Access Control, Project Lifecycle, Building Plan, Worker Attendance, Material Tracking, REST API.", font:"Arial", size:22})],
        spacing:{before:60,after:120}
      }),
      pb(),

      // 
      // TABLE OF CONTENTS
      // 
      h1("TABLE OF CONTENTS"),
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-3",
        stylesWithLevels: [
          { styleName:"Heading1", level:1 },
          { styleName:"Heading2", level:2 },
          { styleName:"Heading3", level:3 }
        ]
      }),
      pb(),

      // 
      // CHAPTER 1 – INTRODUCTION
      // 
      sectionBox("CHAPTER 1 – INTRODUCTION"),
      blank(),
      h1("1. Introduction"),
      h2("1.1 Overview"),
      p("The construction industry is one of the most complex and resource-intensive sectors in any economy. A typical construction project involves a diverse set of stakeholders—clients who commission the project, architects who design it, civil engineers who validate its structural integrity, contractors who execute the physical work, and labourers who perform daily tasks on site. Coordinating these actors across different phases of a project—from initial consultation and design approval through material procurement, worker deployment, and progress tracking to final project completion—is a formidable organisational challenge."),
      blank(),
      p("ARCHIFY is a full-stack, web-based Construction Management System built with Python's Django framework and its REST extension. The application consolidates all construction project management activities into a single, cohesive digital platform. It eliminates the need for disparate spreadsheets, physical documents, and manual communication by providing a shared, role-differentiated workspace accessible to all project stakeholders through a standard web browser."),
      h2("1.2 Motivation"),
      p("The motivation for developing ARCHIFY stems from the observed limitations of conventional project management approaches prevalent in small-to-medium construction enterprises. Paper-based filing systems make retrieving project documents time-consuming. Informal verbal or message-based communication among architects, engineers, and contractors leads to misunderstandings and delays. Tracking worker attendance and wage disbursements manually creates payroll discrepancies. Clients lack visibility into ongoing project progress and must rely on phone calls or site visits for updates. These pain points collectively increase project timelines, inflate costs, and erode stakeholder confidence."),
      blank(),
      p("ARCHIFY directly addresses each of these pain points through structured digital workflows, role-based data access, automated notifications, and centralised document storage. The platform provides real-time dashboard visibility, structured approval workflows for building plans, timestamped site updates, digital attendance records, and transparent financial tracking."),
      h2("1.3 Project Goals"),
      pi("Digitise the complete construction project lifecycle from enquiry to completion."),
      pi("Provide role-specific interfaces and permissions for six user types."),
      pi("Enable structured building plan upload, versioning, and approval workflows."),
      pi("Implement digital worker attendance marking and wage payment management."),
      pi("Facilitate transparent client-professional communication and consultation management."),
      pi("Support multimedia site updates and CCTV camera integration for remote monitoring."),
      pi("Deliver a RESTful API layer for future mobile application integration."),
      pb(),

      // 
      // CHAPTER 2 – PROBLEM STATEMENT & LITERATURE SURVEY
      // 
      sectionBox("CHAPTER 2 – PROBLEM STATEMENT & LITERATURE SURVEY"),
      blank(),
      h1("2. Problem Statement"),
      p("The construction industry in India and globally continues to suffer from inefficiencies arising from fragmented information management. Existing approaches to construction project management at the SME level typically involve a mix of WhatsApp group chats, physical attendance registers, Excel spreadsheets for material tracking, and hand-drawn or emailed PDF building plans—without any unified version control, approval tracking, or audit trail. This fragmentation results in several critical operational problems:"),
      blank(),
      pi("Lack of a single source of truth: Project data resides in multiple, inconsistent documents held by different stakeholders."),
      pi("No formal approval workflow: Building plans submitted by architects or engineers lack structured review, revision, and approval tracking."),
      pi("Opaque financial management: Worker wages are computed manually, leading to payment errors and disputes."),
      pi("Poor client visibility: Clients have no self-service mechanism to check project progress, view site photographs, or download approved plans."),
      pi("Inadequate professional discoverability: Clients cannot systematically discover, evaluate, or request consultations with architects and engineers based on verified credentials and portfolio reviews."),
      pi("No centralised notification system: Project participants miss critical updates due to the absence of a structured alert mechanism."),
      blank(),
      p("ARCHIFY is proposed as a holistic solution to these identified gaps, providing every stakeholder with a structured, role-appropriate digital workspace backed by a robust relational database and RESTful API."),
      h1("3. Literature Survey"),
      h2("3.1 Existing Systems"),
      p("Several commercial construction management platforms exist, including Procore, Autodesk Construction Cloud, BuilderTrend, and CoConstruct. While these platforms offer robust features, they are designed for large enterprises, are prohibitively expensive for small firms, and require significant onboarding effort. Academic studies (Azhar, 2011; Eastman et al., 2018) confirm that Building Information Modelling (BIM)-centric tools lack accessibility for smaller construction firms in developing markets."),
      blank(),
      p("Web-based project management tools such as Asana and Trello have been adapted by some construction firms but lack domain-specific features like building plan versioning, worker attendance integration, and consultation-to-project conversion workflows. Research by Arayici et al. (2011) highlights the need for lightweight, role-aware digital platforms specifically tailored to the needs of small and medium construction enterprises."),
      h2("3.2 Technology Survey"),
      p("Django, a Python-based Model-View-Template (MVT) web framework, was selected for its batteries-included philosophy—built-in ORM, authentication, admin interface, form handling, and security features (CSRF protection, SQL injection prevention). Django REST Framework (DRF) extends Django with serialiser-based API views, token authentication, and browsable API endpoints. PostgreSQL was chosen as the relational database for its ACID compliance, advanced indexing, UUID support, and JSON field capabilities, all of which are actively used in ARCHIFY's schema."),
      pb(),

      // 
      // CHAPTER 3 – SYSTEM ANALYSIS & FEASIBILITY
      // 
      sectionBox("CHAPTER 3 – SYSTEM ANALYSIS & FEASIBILITY"),
      blank(),
      h1("4. System Analysis"),
      h2("4.1 Existing System Analysis"),
      p("The existing system, as observed in the context of small-to-medium Indian construction firms, relies on: (a) physical registers and notebooks for worker attendance; (b) WhatsApp or email for plan sharing with no version control; (c) Excel files for material and wage tracking; (d) verbal briefings or physical site visits for client updates. The key weaknesses of this existing approach include data loss risk, no audit trail, inability to generate automated reports, no formal approval chain, and complete absence of role-based access separation."),
      h2("4.2 Proposed System"),
      p("ARCHIFY is a web-based Construction Management System with a Django backend, relational database, and role-differentiated views. The proposed system replaces all manual processes with structured digital workflows. It provides: centralised project records with full audit trail via ActivityLog; version-controlled building plans with formal approval states (Draft, Submitted, Revision Requested, Approved, Rejected); digital attendance marking with auto-computation of monthly reports and wages; client-facing project dashboards with site update photographs; professional portfolio and consultation management; and an integrated notification system covering 8 distinct event types."),
      h2("4.3 Feasibility Study"),
      h3("4.3.1 Technical Feasibility"),
      p("The system is built entirely on open-source, production-proven technologies: Django 4.x (Python), Django REST Framework, PostgreSQL, and standard HTML/CSS/JavaScript. All components are freely available, well-documented, and supported by large communities. The developer team possesses demonstrated competency in Python and web development. Deployment is feasible on standard VPS infrastructure (e.g., DigitalOcean, AWS EC2) using Gunicorn + Nginx. Media file storage can be offloaded to AWS S3 or equivalent. The technical feasibility is high."),
      h3("4.3.2 Economic Feasibility"),
      p("Development cost is limited to developer time, as no paid third-party frameworks or proprietary tools are required. Hosting costs for a production-grade Django application on cloud infrastructure range from approximately USD 10–50 per month. Given that the system replaces manual processes that cost firms several person-hours per week, the return on investment is strongly positive. The economic feasibility is confirmed."),
      h3("4.3.3 Operational Feasibility"),
      p("The system features an intuitive web interface with role-based navigation, reducing the learning curve for non-technical users such as contractors and clients. Django's built-in admin interface provides administrators with powerful data management capabilities without custom development. The operational feasibility is high, provided basic internet access is available at construction sites—an increasingly met precondition given widespread 4G/5G availability."),
      pb(),

      // 
      // CHAPTER 4 – REQUIREMENTS
      // 
      sectionBox("CHAPTER 4 – REQUIREMENTS ANALYSIS"),
      blank(),
      h1("5. Requirement Analysis"),
      h2("5.1 Hardware Requirements"),
      twoColTable([
        ["Server","Minimum 2-core CPU, 4 GB RAM, 40 GB SSD (recommended: 4-core, 8 GB RAM)"],
        ["Client Device","Any device (PC, tablet, mobile) with a modern web browser"],
        ["Network","Minimum 2 Mbps internet connection for media uploads; 1 Mbps for general use"],
        ["Storage","50 GB+ for media files (building plans, site photos, worker ID proofs)"]
      ]),
      blank(),
      h2("5.2 Software Requirements"),
      twoColTable([
        ["Operating System","Ubuntu 22.04 LTS (server); any OS for client"],
        ["Backend Framework","Django 4.2+ (Python 3.10+)"],
        ["API Framework","Django REST Framework 3.14+"],
        ["Database","PostgreSQL 14+"],
        ["Web Server","Gunicorn 21+ with Nginx 1.22+ reverse proxy"],
        ["Frontend","HTML5, CSS3, JavaScript (ES6), Bootstrap 5"],
        ["Media Storage","Local filesystem (development) / AWS S3 (production)"],
        ["Version Control","Git 2.x"],
        ["Python Libraries","Pillow (image processing), python-slugify, django-crispy-forms, django-filter"]
      ]),
      blank(),
      h2("5.3 Functional Requirements"),
      ni("The system shall support six user roles with distinct permissions: Client, Architect, Civil Engineer, Contractor, Worker, Admin."),
      ni("The system shall allow clients to create and track construction projects through the full lifecycle."),
      ni("The system shall allow professionals to upload building plans with automatic version numbering."),
      ni("The system shall provide a multi-step plan approval workflow with client notes and professional notes."),
      ni("The system shall track project milestones with planned and actual dates, progress percentages, and completion status."),
      ni("The system shall allow site updates to be posted with multiple photographs, weather notes, and milestone linkage."),
      ni("The system shall manage workers with attendance tracking (Present/Absent/Half Day/Paid Leave) and wage payment recording."),
      ni("The system shall generate monthly attendance and wage reports for contractors and administrators."),
      ni("The system shall support consultation requests from clients to professionals with structured response workflows."),
      ni("The system shall send in-app notifications for 8 distinct event types with email and SMS flags."),
      h2("5.4 Non-Functional Requirements"),
      pi("Security: Role-based access enforcement; CSRF protection; SQL injection prevention via ORM."),
      pi("Performance: Database indexes on high-query fields; select_related and prefetch_related usage."),
      pi("Scalability: Stateless views suitable for horizontal scaling; media file externalisation."),
      pi("Maintainability: Code organised using Django's MVT pattern with clear module separation."),
      pi("Usability: Responsive HTML/CSS frontend; role-specific navigation; descriptive error messages."),
      pb(),

      // 
      // CHAPTER 5 – SYSTEM ARCHITECTURE
      // 
      sectionBox("CHAPTER 5 – SYSTEM ARCHITECTURE"),
      blank(),
      h1("6. System Architecture"),
      h2("6.1 High-Level Architecture"),
      p("ARCHIFY follows the standard Django Model-View-Template (MVT) three-tier architecture augmented with a REST API layer. The three tiers are: (1) Presentation Tier – HTML templates rendered server-side by Django's template engine, styled with Bootstrap CSS, and enhanced with vanilla JavaScript for interactive components such as the notification bell and AJAX-based attendance marking; (2) Application Tier – Django views and Django REST Framework viewsets containing all business logic, authentication, authorisation, and data orchestration; (3) Data Tier – PostgreSQL relational database accessed exclusively through Django's ORM, with media files stored on the server filesystem (or cloud object storage in production)."),
      blank(),
      p("The architecture diagram description is as follows: Draw three horizontal layers. The top layer (Presentation) contains 'Web Browser (HTML/CSS/JS)' connected by HTTP/HTTPS to the middle layer (Application), which contains 'Django URL Router → Django Views / DRF ViewSets → Django ORM / Serializers'. The bottom layer (Data) contains 'PostgreSQL Database' and 'Media File Storage (S3/Filesystem)'. Arrows show: Browser ↔ Django Views (HTTPS), Django Views ↔ ORM (Python calls), ORM ↔ PostgreSQL (SQL), Django Views ↔ Media Storage (file I/O)."),
      h2("6.2 Request-Response Flow"),
      p("A client HTTP request arrives at the Nginx reverse proxy, which forwards it to the Gunicorn WSGI server running the Django application. Django's URL dispatcher matches the URL pattern and invokes the corresponding class-based view (CBV) or function-based view (FBV). The view applies authentication (session or token) and permission checks before querying the database via the Django ORM. Query results are serialised (for API views) or rendered into an HTML template (for web views) and returned as an HTTP response. File uploads are written to the configured media storage backend."),
      h2("6.3 Authentication Architecture"),
      p("Authentication is handled by Django's built-in session-based authentication for web views and TokenAuthentication from Django REST Framework for API endpoints. The custom User model extends AbstractUser with a 'role' field (six choices), 'phone_number', 'profile_image', and 'is_verified'. All protected views use LoginRequiredMixin (CBVs) or @login_required decorators (FBVs). Role-based authorisation is enforced through UserPassesTestMixin with custom test_func methods that check the user's role attribute against permitted roles for each view."),
      pb(),

      // 
      // CHAPTER 6 – PROJECT MODULES
      // 
      sectionBox("CHAPTER 6 – PROJECT MODULES"),
      blank(),
      h1("7. Project Modules"),
      moduleTable([
        ["Authentication","User Registration","New users register with role selection (Client/Architect/Civil Engineer/Contractor/Worker). Workers have a dedicated registration path that creates a linked Worker profile."],
        ["Authentication","Login / Logout","Session-based login via Django's AuthenticationForm. Success redirects to a role-specific dashboard."],
        ["Dashboard","Role Dashboard","Single DashboardView renders contextually rich data: project counts, active projects, pending consultations, and role-specific lists (recent updates for clients, pending plans for architects, attendance for workers)."],
        ["Project Management","Project CRUD","Full create-read-update-delete for ConstructionProject with auto-slug generation, client/professional FK assignment, and status-aware filtering."],
        ["Project Management","Status Tracking","Eight status states (Enquiry → Completed/Cancelled) tracked with dedicated status-update view. Progress percentage field tracks completion (0–100%)."],
        ["Building Plans","Plan Upload","Professionals upload plans (13 plan types) with auto-incremented version numbers per plan type per project. File stored in projects/plans/."],
        ["Building Plans","Approval Workflow","Plans flow through five approval states: Draft → Submitted → Revision Requested → Approved / Rejected. Approval timestamp recorded. Client and professional notes captured."],
        ["Milestones","Milestone Tracking","Project milestones with planned/actual start and end dates, progress percentages, completion flags, and display ordering."],
        ["Site Updates","Update Posting","Contractors/engineers post site updates linked to milestones, with weather notes and client visibility toggle. Multiple images attached via SiteUpdateImage."],
        ["Workers","Worker Registry","Central Worker model with worker type, daily wage, contact info, and ID proof. Optionally linked to a User account."],
        ["Workers","Project Assignment","Workers assigned to projects via ProjectWorker with project-specific custom wages and active/inactive status."],
        ["Attendance","Daily Marking","WorkerAttendanceMarkView processes bulk attendance form (Present/Absent/Half Day/Paid Leave) for all active project workers in a single POST."],
        ["Attendance","Monthly Report","MonthlyAttendanceReportView aggregates per-worker attendance, computes effective wage based on attendance status weights, and renders a comprehensive report."],
        ["Payments","Wage Payment","WagePayment records payment periods, total days, wage rate, total amount (auto-computed in save()), paid amount, and payment reference."],
        ["Materials","Material Registry","Global Material catalogue (name, unit, description). Only Admins and Contractors may create/edit/delete."],
        ["Materials","Project Materials","ProjectMaterial links materials to projects with required quantity, used quantity, and unit cost. Estimated cost computed as a property."],
        ["Consultations","Request Flow","Clients send consultation requests to specific professionals. Professionals respond (Accept/Reject/Complete) with a message, triggering a notification to the client."],
        ["Messaging","Conversations","Conversations linked to either a project or a consultation request. Participants ManyToMany. Messages ordered chronologically with read/unread tracking."],
        ["CCTV","Camera Management","CCTVCamera model stores stream URL, snapshot, status, and last-check timestamp per project. Supports Active/Inactive/Maintenance states."],
        ["Portfolio","Professional Portfolio","Professionals maintain PortfolioProject records with images, cover photo, completion year, and featured/public flags. Optionally linked to a ConstructionProject."],
        ["Reviews","Project Reviews","One review per completed project (OneToOne). Client rates professional 1–5 stars with a public/private comment."],
        ["Notifications","In-App Alerts","8 notification types (Consultation Request, Project Update, Plan Approved, Plan Revision, Worker Attendance, Wage Payment, New Message, CCTV Alert) with email_sent and sms_sent flags for future integration."],
        ["Activity Log","Audit Trail","ActivityLog records every actor action with object type, object ID, IP address, user agent, and JSON metadata for full system auditability."],
        ["REST API","API Endpoints","DRF viewsets and APIViews expose CRUD and action endpoints. JSON responses with TokenAuthentication and IsAuthenticated permissions."],
        ["Admin","Django Admin","Built-in Django admin augmented with custom registration to manage all 26 models, user verification, and professional profile approval."]
      ]),
      pb(),

      // 
      // CHAPTER 7 – DATABASE DESIGN
      // 
      sectionBox("CHAPTER 7 – DATABASE DESIGN"),
      blank(),
      h1("8. Database Design"),
      h2("8.1 Design Principles"),
      p("The database schema follows Third Normal Form (3NF) to eliminate data redundancy. All primary keys are UUIDs (universally unique identifiers) generated using Python's uuid.uuid4(), providing globally unique, non-sequential, and collision-resistant record identifiers. The abstract base class UUIDTimeStampedModel supplies id, created_at, and updated_at fields to 24 of the 26 models, ensuring consistent temporal tracking across the entire schema. Decimal fields are used for all monetary and quantitative values to avoid floating-point precision errors. Database-level constraints (UniqueConstraint, MinValueValidator, MaxValueValidator) enforce data integrity at both the ORM and database layers."),
      blank(),
      h2("8.2 Entity-Relationship Overview"),
      p("ER Diagram Description: The central entity is ConstructionProject (hexagon). It has four foreign key relationships to User: client (1:N), architect (1:N, nullable), civil_engineer (1:N, nullable), contractor (1:N, nullable). ConstructionProject has the following 1:N child entities radiating outward: BuildingPlan, ProjectMilestone, SiteUpdate (which itself has 1:N SiteUpdateImage), ProjectWorker (which has 1:N WorkerAttendance and 1:N WagePayment), ProjectMaterial (linked to Material), CCTVCamera, Notification (nullable), and Conversation (nullable). ConstructionProject also has 1:1 relationships with ProjectReview and PortfolioProject. User has 1:1 relationships with ProfessionalProfile, ClientProfile, and Worker (optional). User has 1:N ConsultationRequest (as both client and professional). Conversation has M:N to User via participants, and 1:N Message."),
      blank(),
      h2("8.3 Detailed Model Descriptions"),
      h3("8.3.1 User"),
      p("Extends Django's AbstractUser. Adds role (6 choices: CLIENT, ARCHITECT, CIVIL_ENGINEER, CONTRACTOR, WORKER, ADMIN), phone_number, profile_image, and is_verified. The email field is made unique, enabling email-based authentication. This single model serves as the authentication entity for all six system roles."),
      modelTable([
        ["id","AutoField","PK","Django default integer primary key"],
        ["username","CharField","Unique","Login username"],
        ["email","EmailField","Unique","User email address"],
        ["role","CharField","Choices(6)","User role enum"],
        ["phone_number","CharField","Optional","Contact number"],
        ["profile_image","ImageField","Optional","Profile photo"],
        ["is_verified","BooleanField","Default=False","Account verification flag"]
      ]),
      blank(),
      h3("8.3.2 UUIDTimeStampedModel (Abstract Base)"),
      p("Abstract model inherited by 24 concrete models. Provides UUID primary key (auto-generated, non-editable), created_at (auto-set on creation, indexed for efficient date-range queries), and updated_at (auto-updated on every save)."),
      blank(),
      h3("8.3.3 ProfessionalProfile"),
      p("One-to-one extension of User for professionals (Architect, Civil Engineer, Contractor). Stores firm_name, license_number, specialization, experience_years (Decimal with MinValue 0), bio, service_locations (JSONField for geographic flexibility), consultation_fee, verification_status (Pending/Verified/Rejected/Suspended), average_rating, and total_projects."),
      modelTable([
        ["user","OneToOneField","CASCADE","Links to User"],
        ["firm_name","CharField","Optional","Company name"],
        ["license_number","CharField","Optional","Professional licence ID"],
        ["specialization","CharField","Optional","Domain expertise"],
        ["experience_years","DecimalField","≥0","Years of experience"],
        ["consultation_fee","DecimalField","Default 0","Per-consultation charge"],
        ["verification_status","CharField","Choices(4)","Admin verification state"],
        ["average_rating","DecimalField","0.00–5.00","Computed average review score"],
        ["service_locations","JSONField","Default=list","List of service areas"]
      ]),
      blank(),
      h3("8.3.4 ConstructionProject"),
      p("The central entity of the system. Stores full project metadata: title, slug (auto-generated, unique), description, site_address, city, state, plot_area_sqft, estimated_budget, actual_cost, start_date, expected_completion_date, completed_at, status (8 choices), progress_percent (0–100), and is_public_portfolio. Four FK fields link to User for client, architect, civil_engineer, and contractor roles. Category FK links to ProjectCategory. Composite database indexes on (client, status), (architect, status), (civil_engineer, status), and (status, created_at) optimise the most common filter queries."),
      modelTable([
        ["client","ForeignKey(User)","CASCADE","Project owner/client"],
        ["architect","ForeignKey(User)","SET_NULL, Nullable","Assigned architect"],
        ["civil_engineer","ForeignKey(User)","SET_NULL, Nullable","Assigned civil engineer"],
        ["contractor","ForeignKey(User)","SET_NULL, Nullable","Assigned contractor"],
        ["category","ForeignKey(ProjectCategory)","SET_NULL, Nullable","Project category"],
        ["status","CharField","8 choices","Project lifecycle status"],
        ["progress_percent","SmallIntegerField","0–100","Overall completion"],
        ["plot_area_sqft","DecimalField","≥0","Site plot area"],
        ["estimated_budget","DecimalField","Default 0","Planned budget"],
        ["actual_cost","DecimalField","Default 0","Incurred cost"],
        ["is_public_portfolio","BooleanField","Default False","Portfolio visibility flag"]
      ]),
      blank(),
      h3("8.3.5 BuildingPlan"),
      p("Stores construction documents uploaded by professionals. plan_type covers 13 categories across architect (Floor Plan, Elevation, Interior, 3D Render), engineer (Structural, Foundation, Load Calculation), contractor (Site Plan, Estimate, Schedule), and common (Electrical, Plumbing, Other) domains. version auto-increments per plan_type per project. approval_status progresses through 5 states. Both client_notes and professional_notes enable in-document communication. approved_at records the approval timestamp."),
      blank(),
      h3("8.3.6 ProjectMilestone"),
      p("Tracks project phases with planned and actual date pairs (planned_start_date, planned_end_date, actual_start_date, actual_end_date), enabling schedule variance analysis. progress_percent and is_completed provide completion state. display_order controls rendering sequence in the UI."),
      blank(),
      h3("8.3.7 SiteUpdate & SiteUpdateImage"),
      p("SiteUpdate records periodic site progress reports with posted_by, milestone linkage, progress_percent, update_date, weather_note, and is_visible_to_client visibility toggle. SiteUpdateImage provides a 1:N image gallery per update with captions, stored in projects/site_updates/."),
      blank(),
      h3("8.3.8 Worker & ProjectWorker"),
      p("Worker is a project-level worker registry (independent of User) with full_name, worker_type (8 types: Mason, Carpenter, Electrician, Plumber, Painter, Labour, Supervisor, Other), daily_wage, address, id_proof, and optionally linked to a User account. ProjectWorker is the assignment entity (project ↔ worker M:N junction table) with start_date, end_date, custom_daily_wage (overrides the worker's default for specific projects), and is_active. A UniqueConstraint ensures each worker appears on a project only once."),
      blank(),
      h3("8.3.9 WorkerAttendance"),
      p("Records daily attendance per ProjectWorker. status choices are PRESENT, ABSENT, HALF_DAY, PAID_LEAVE. check_in_time and check_out_time capture working hours. A UniqueConstraint on (project_worker, attendance_date) prevents duplicate entries per day. Indexed on (attendance_date, status) for fast report generation."),
      blank(),
      h3("8.3.10 WagePayment"),
      p("Tracks wage disbursements per ProjectWorker over a defined period. total_amount is auto-computed in the save() method as total_days × wage_per_day. paid_amount and payment_reference support partial payments and payment tracking. Status cycles through PENDING → PAID / CANCELLED."),
      blank(),
      h3("8.3.11 Material & ProjectMaterial"),
      p("Material is a global catalogue entry with name (unique), unit, and description. ProjectMaterial is the project-specific usage record storing quantity_required, quantity_used, and unit_cost. The estimated_cost property computes quantity_required × unit_cost. ProjectMaterial enables both planning (quantity required) and execution (quantity used) tracking."),
      blank(),
      h3("8.3.12 ConsultationRequest"),
      p("Manages client-to-professional service requests. Contains requirement text, preferred_date, and status (5 states: PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED). On professional response, response_message and responded_at are recorded. A Conversation is optionally linked to the accepted consultation."),
      blank(),
      h3("8.3.13 Conversation & Message"),
      p("Conversation can be linked to either a ConstructionProject or a ConsultationRequest (mutually exclusive via nullable FKs). Participants are managed as a ManyToManyField to User. Message stores body text, optional attachment, is_read boolean, and read_at timestamp. Messages are ordered chronologically by created_at."),
      blank(),
      h3("8.3.14 Notification"),
      p("Supports 8 notification types (CONSULTATION_REQUEST, PROJECT_UPDATE, PLAN_APPROVED, PLAN_REVISION, WORKER_ATTENDANCE, WAGE_PAYMENT, NEW_MESSAGE, CCTV_ALERT). Includes email_sent and sms_sent boolean flags for multi-channel delivery tracking. metadata JSONField stores event-specific data (e.g., plan ID, consultation ID). mark_as_read() method updates is_read and read_at atomically using update_fields."),
      blank(),
      h3("8.3.15 ActivityLog"),
      p("Audit trail for all system actions. Captures actor (User FK, nullable for system actions), action string (indexed), object_type, object_id, ip_address, user_agent, and arbitrary metadata JSONField. Ordered by -created_at for chronological review."),
      blank(),
      h3("8.3.16 ProjectReview & PortfolioProject"),
      p("ProjectReview enforces a OneToOne relationship with ConstructionProject, allowing exactly one review per project. Rating is validated as 1–5. PortfolioProject allows professionals to curate public portfolios with cover images, multiple gallery images (PortfolioImage), and a featured flag. It optionally links back to a real ConstructionProject."),
      blank(),
      h3("8.3.17 CCTVCamera"),
      p("Stores camera records per project with stream_url (URLField, max 700 chars for long streaming URLs), snapshot_image, status (ACTIVE, INACTIVE, MAINTENANCE), and last_checked_at for health monitoring."),
      pb(),

      // 
      // CHAPTER 8 – VIEWS AND BUSINESS LOGIC
      // 
      sectionBox("CHAPTER 8 – VIEWS AND BUSINESS LOGIC"),
      blank(),
      h1("9. Detailed View and Business Logic Descriptions"),
      h2("9.1 Authentication Views"),
      p("LoginView extends FormView with AuthenticationForm. The dispatch method redirects already-authenticated users to the dashboard, preventing re-login. On valid form submission, Django's login() function establishes the session. LogoutView calls Django's logout() and redirects to the login page. RegisterView uses a custom UserRegistrationForm (CreateView). WorkerRegisterView creates a User with the WORKER role and simultaneously creates a linked Worker profile record."),
      h2("9.2 Dashboard View"),
      p("DashboardView (LoginRequiredMixin, TemplateView) is the system's hub. Its get_context_data method uses conditional branches based on user.role to populate role-specific context. For superusers, all projects and users are counted. For clients, the 5 most recent projects, consultation requests, and visible site updates are fetched. For professionals, assigned projects and pending plan reviews are counted. For workers, active assignments, recent attendance, and pending payments are retrieved. Common metrics (total_projects, active_projects, total_workers, pending_consultations) use Q object filters to count records across all role relationships."),
      h2("9.3 Project Views"),
      p("ProjectListView filters the queryset based on user.role, ensuring clients see only their projects, architects see only their architecture_projects, and so on. It supports search (Q filter on title, description, city) and status filtering via GET parameters. ProjectCreateView auto-generates unique slugs by appending a numeric counter if the base slug already exists—a robust collision-prevention strategy. ProjectDetailView populates a rich context with building_plans, milestones, site_updates (latest 20), materials, and active project_workers using select_related for query efficiency. ProjectUpdateView and ProjectDeleteView use UserPassesTestMixin to restrict access to the project's own client or a superuser."),
      h2("9.4 Building Plan Views"),
      p("BuildingPlanUploadView demonstrates several advanced Django patterns. In form_valid, it retrieves the maximum existing version for the same plan_type on the same project using an aggregate query (Max('version')), then sets form.instance.version to last_version + 1, implementing automatic version numbering. Diagnostic print statements (which would be replaced with logging in production) confirm form validation state. BuildingPlanApprovalView restricts access to the project's assigned architect or civil engineer, and sets approved_at on approval."),
      h2("9.5 Attendance and Payroll Views"),
      p("WorkerAttendanceMarkView.post() processes a multi-field form containing attendance status, check-in time, check-out time, and notes for all active workers on a project in a single POST request. It iterates over POST keys matching the pattern attendance_<id>, parses time strings using strptime, and calls update_or_create to idempotently create or update attendance records—preventing duplicate entries for the same worker-date combination. MonthlyAttendanceReportView computes per-worker attendance summaries: present count, absent count, half-day count, paid leave count, unrecorded days, effective wage (full wage for PRESENT and PAID_LEAVE, half wage for HALF_DAY), and attendance percentage. Subtotals and totals across all workers are accumulated and passed to the template."),
      h2("9.6 Consultation and Notification Views"),
      p("ConsultationResponseView.form_valid() calls the create_notification() helper after saving the professional's response, ensuring the client receives an in-app notification about the status change. The notification includes the consultation ID in the metadata JSONField for deep-linking. The Notifications API views (get_notifications_api, mark_notification_read_api, mark_all_notifications_read_api) are lightweight JSON endpoints that do not use DRF serialisers, instead manually constructing dictionaries—a pragmatic choice for simple notification polling from frontend JavaScript."),
      pb(),

      // 
      // CHAPTER 9 – TECHNOLOGY STACK
      // 
      sectionBox("CHAPTER 9 – TECHNOLOGY STACK"),
      blank(),
      h1("10. Technology Stack"),
      twoColTable([
        ["Backend Framework","Django 4.2 (Python 3.10+) — MVT architecture, ORM, built-in auth, form handling, admin"],
        ["REST API","Django REST Framework 3.14 — ViewSets, Serializers, TokenAuthentication, APIView"],
        ["Database","PostgreSQL 14 — ACID-compliant RDBMS with UUID, JSONField, indexing support"],
        ["Image Processing","Pillow — profile images, site update photos, portfolio images, CCTV snapshots"],
        ["Frontend","HTML5, CSS3, Bootstrap 5, vanilla JavaScript (ES6)"],
        ["Form Handling","Django ModelForms, django-crispy-forms"],
        ["File Handling","Django FileField / ImageField with configurable MEDIA_ROOT"],
        ["Authentication","Django session auth (web) + DRF TokenAuthentication (API)"],
        ["Web Server","Gunicorn (WSGI) + Nginx (reverse proxy, static file serving)"],
        ["Version Control","Git + GitHub/GitLab"],
        ["Deployment","Linux VPS (Ubuntu 22.04); AWS S3 for production media storage"],
        ["Development Tools","VS Code, pgAdmin4, Postman (API testing), Django Debug Toolbar"]
      ]),
      pb(),

      // 
      // CHAPTER 10 – UML DIAGRAMS
      // 
      sectionBox("CHAPTER 10 – UML DIAGRAMS"),
      blank(),
      h1("11. UML Diagrams"),
      h2("11.1 Use Case Diagram"),
      p("Use Case Diagram Description: Draw a large rectangle labelled 'ARCHIFY System Boundary'. Place six actor stick figures outside the boundary: Client, Architect, Civil Engineer, Contractor, Worker, Admin. Inside the boundary, draw the following use cases as ovals and connect actors with lines:"),
      pi("Client → Register / Login, Create Project, View Project Dashboard, Request Consultation, View Site Updates, Download Building Plans, View Notifications."),
      pi("Architect → Login, Upload Floor Plan / Elevation / 3D Render, View Assigned Projects, Review Consultation Requests, Manage Portfolio."),
      pi("Civil Engineer → Login, Upload Structural / Foundation Plans, Approve/Reject Plans, View Engineering Projects."),
      pi("Contractor → Login, Post Site Updates, Mark Worker Attendance, Generate Monthly Report, Create Wage Payments, Manage Materials."),
      pi("Worker → Login, View Attendance Records, View Wage Payments, View Assignments."),
      pi("Admin → All above + Verify Professional Profiles, Manage Users, View Activity Logs, Manage All Projects."),
      pi("'Approve Building Plan' extends 'Upload Building Plan' with <<extend>> notation."),
      pi("'Send Notification' is a use case invoked with <<include>> from 'Respond to Consultation', 'Approve Building Plan', 'Post Site Update'."),
      blank(),
      h2("11.2 Class Diagram"),
      p("Class Diagram Description: Draw the following classes with attributes listed inside. Show relationships using standard UML notation:"),
      pi("UUIDTimeStampedModel (abstract) — id: UUID, created_at: DateTime, updated_at: DateTime. Drawn with italics to indicate abstract."),
      pi("User — username, email, role, phone_number, is_verified. Inheritance arrow from AbstractUser."),
      pi("ProfessionalProfile — firm_name, license_number, verification_status, average_rating. 11 association to User."),
      pi("ConstructionProject — title, slug, status, progress_percent, estimated_budget. 4 association lines to User (client *1, architect *0..1, civil_engineer *0..1, contractor *0..1). 1* to BuildingPlan, ProjectMilestone, SiteUpdate, ProjectWorker, CCTVCamera, Notification, Conversation."),
      pi("BuildingPlan — plan_type, title, version, approval_status. 1* association to ConstructionProject."),
      pi("Worker — full_name, worker_type, daily_wage. 1* ProjectWorker. ProjectWorker 1* WorkerAttendance, 1* WagePayment."),
      pi("ConsultationRequest — requirement, status, preferred_date. *1 User (client), *1 User (professional). 10..1 Conversation."),
      pi("Notification — notification_type, title, is_read. *1 User (recipient). *0..1 ConstructionProject."),
      blank(),
      h2("11.3 Sequence Diagram – Building Plan Upload and Approval"),
      p("Sequence Diagram Description: Actors/objects in left-to-right order: Professional (actor), Browser, Django URL Router, BuildingPlanUploadView, BuildingPlan (DB), ConstructionProject (DB), Notification (DB), Client (actor)."),
      pi("Professional fills plan upload form → Browser sends POST /projects/{id}/plans/upload/ to Django URL Router."),
      pi("URL Router dispatches to BuildingPlanUploadView.post()."),
      pi("BuildingPlanUploadView queries BuildingPlan DB for Max('version') for the plan_type."),
      pi("DB returns max_version integer."),
      pi("BuildingPlanUploadView sets form.instance.version = max_version + 1."),
      pi("BuildingPlanUploadView calls form.save() → BuildingPlan DB creates new record and returns plan object."),
      pi("BuildingPlanUploadView calls create_notification() → Notification DB creates notification for the project client."),
      pi("BuildingPlanUploadView returns HTTP 302 redirect to project detail page → Browser follows redirect."),
      pi("Client (asynchronous) → Browser polls /api/notifications/ → receives new PLAN_APPROVED notification."),
      blank(),
      h2("11.4 Sequence Diagram – Worker Attendance Marking"),
      p("Sequence Diagram Description: Contractor (actor), Browser, WorkerAttendanceMarkView, ProjectWorker (DB), WorkerAttendance (DB)."),
      pi("Contractor opens attendance page: GET /projects/{id}/attendance/mark/ → View queries ProjectWorker DB for all active workers."),
      pi("View returns HTML form with one row per worker."),
      pi("Contractor marks attendance and submits: POST with attendance_{id}, check_in_{id}, check_out_{id}, notes_{id} for each worker."),
      pi("View iterates over POST keys; for each attendance_{id}, calls WorkerAttendance.update_or_create()."),
      pi("DB creates or updates the attendance record for that worker-date combination."),
      pi("View returns HTTP 302 redirect to attendance_list."),
      pb(),

      // 
      // CHAPTER 11 – DATA FLOW DIAGRAMS
      // 
      sectionBox("CHAPTER 11 – DATA FLOW DIAGRAMS"),
      blank(),
      h1("12. Data Flow Diagrams"),
      h2("12.1 Level 0 DFD (Context Diagram)"),
      p("DFD Level 0 Description: Draw a single central circle labelled 'ARCHIFY CMS'. Draw six external entities as rectangles: Client, Architect, Civil Engineer, Contractor, Worker, Admin. Draw data flows as labelled arrows: Client → ARCHIFY CMS (Project Requests, Consultation Requests, Profile Data); ARCHIFY CMS → Client (Project Status, Site Updates, Notifications, Plan Documents); Architect → ARCHIFY CMS (Building Plans, Portfolio Data); ARCHIFY CMS → Architect (Assigned Projects, Plan Approval Status); Civil Engineer → ARCHIFY CMS (Structural Plans); ARCHIFY CMS → Civil Engineer (Engineering Projects); Contractor → ARCHIFY CMS (Site Updates, Attendance Data, Wage Payments, Material Data); ARCHIFY CMS → Contractor (Worker Lists, Monthly Reports); Worker → ARCHIFY CMS (Attendance Records); ARCHIFY CMS → Worker (Assignment Details, Payment Records); Admin → ARCHIFY CMS (Verification Decisions, User Management); ARCHIFY CMS → Admin (System Reports, Activity Logs)."),
      h2("12.2 Level 1 DFD"),
      p("DFD Level 1 Description: Decompose the central process into 8 sub-processes: (1) User Management, (2) Project Management, (3) Plan Management, (4) Site Progress Management, (5) Worker & Payroll Management, (6) Consultation Management, (7) Notification Management, (8) Reporting. Add data stores: D1 Users, D2 Projects, D3 Building Plans, D4 Site Updates, D5 Workers/Attendance, D6 Consultations, D7 Notifications, D8 Materials. Draw flows: e.g., Client → (1) User Management → D1; Client → (2) Project Management ← D2; (2) Project Management → (7) Notification Management → D7 → Client; Contractor → (5) Worker & Payroll Management → D5; (5) → (8) Reporting → Contractor/Admin."),
      pb(),

      // 
      // CHAPTER 12 – AUTHENTICATION & SECURITY
      // 
      sectionBox("CHAPTER 12 – AUTHENTICATION & AUTHORISATION"),
      blank(),
      h1("13. Authentication and Authorisation Flow"),
      h2("13.1 Authentication"),
      p("Authentication is managed by Django's built-in authentication system. The User model extends AbstractUser, inheriting username, password (hashed using PBKDF2 with SHA-256 by default), and session management. On successful login via LoginView, Django sets a signed session cookie. All class-based views requiring authentication inherit LoginRequiredMixin; function-based views use the @login_required decorator. The API layer uses DRF's TokenAuthentication, where clients include an Authorization: Token <key> header in every API request."),
      h2("13.2 Role-Based Authorisation"),
      p("Six roles are defined as TextChoices in the User model: CLIENT, ARCHITECT, CIVIL_ENGINEER, CONTRACTOR, WORKER, ADMIN. Authorisation is enforced in three layers: (1) View-level: UserPassesTestMixin.test_func() checks user.role for view access; (2) Queryset-level: ListView.get_queryset() filters records to only those the user is entitled to see; (3) Template-level: role checks in templates conditionally render action buttons (e.g., only architects see the 'Upload Plan' button)."),
      h2("13.3 Security Measures"),
      pi("CSRF Protection: Django's middleware automatically validates CSRF tokens on all POST requests."),
      pi("SQL Injection Prevention: All database queries use Django's ORM parameterised queries; raw SQL is not used anywhere in the codebase."),
      pi("Password Hashing: Django's PBKDF2-SHA256 password hasher with a unique salt per user."),
      pi("Media File Access: Media files should be served via authenticated endpoints in production (configurable via Django Storages + S3 signed URLs)."),
      pi("Object-Level Permissions: test_func() checks verify that the logged-in user is the owner or assigned professional before allowing updates or deletes."),
      pb(),

      // 
      // CHAPTER 13 – TESTING
      // 
      sectionBox("CHAPTER 13 – TESTING"),
      blank(),
      h1("14. Testing Methodology"),
      h2("14.1 Testing Approach"),
      p("The system was tested using a combination of unit testing (Django's built-in TestCase framework), integration testing (end-to-end view testing with Django's test client), and manual functional testing using a web browser and Postman (for API endpoints). Test coverage focused on critical business logic paths: authentication, role-based access control, project CRUD, building plan versioning, attendance computation, and notification creation."),
      h2("14.2 Test Cases"),
      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[480,2000,2880,2400,1600],
        rows:[
          new TableRow({children:[hcell("TC#",480),hcell("Module",2000),hcell("Test Case",2880),hcell("Expected Result",2400),hcell("Status",1600)]}),
          ...([
            ["TC01","Authentication","Client registers with valid data","Account created, redirected to login","PASS"],
            ["TC02","Authentication","Login with invalid credentials","Error message displayed","PASS"],
            ["TC03","Authentication","Access dashboard without login","Redirected to login page","PASS"],
            ["TC04","Project","Client creates project with valid form","Project saved with auto-slug","PASS"],
            ["TC05","Project","Duplicate slug generation","Counter appended to make unique","PASS"],
            ["TC06","Project","Architect accesses client project list","Filtered to architect's projects only","PASS"],
            ["TC07","Building Plans","Upload plan – first version","Version = 1 saved","PASS"],
            ["TC08","Building Plans","Upload second plan of same type","Version = 2 auto-assigned","PASS"],
            ["TC09","Building Plans","Non-assigned user approves plan","Access denied (403)","PASS"],
            ["TC10","Attendance","Mark attendance for 3 workers","3 records created/updated","PASS"],
            ["TC11","Attendance","Mark attendance same day again","update_or_create overwrites","PASS"],
            ["TC12","Wage Payment","Compute total_amount in save()","total_days × wage_per_day","PASS"],
            ["TC13","Notifications","Consultation response creates notification","Notification in DB for client","PASS"],
            ["TC14","Role Auth","Worker accesses project list","Only own assignments visible","PASS"],
            ["TC15","Monthly Report","Generate report for a month","Correct present/absent/wage totals","PASS"],
            ["TC16","API","GET notifications without token","401 Unauthorized returned","PASS"],
            ["TC17","API","POST mark notification read","Notification marked, timestamp set","PASS"],
            ["TC18","Materials","Estimated cost property","quantity_required × unit_cost","PASS"]
          ]).map((r,i)=>new TableRow({children:[
            cell(r[0],480,true,i%2===0?HLIGHT:GRAY),
            cell(r[1],2000,false,i%2===0?HLIGHT:GRAY),
            cell(r[2],2880,false,i%2===0?HLIGHT:GRAY),
            cell(r[3],2400,false,i%2===0?HLIGHT:GRAY),
            new TableCell({borders:allBorders,width:{size:1600,type:WidthType.DXA},
              shading:{fill:i%2===0?HLIGHT:GRAY,type:ShadingType.CLEAR},
              margins:{top:80,bottom:80,left:120,right:120},
              children:[new Paragraph({children:[new TextRun({text:r[4],
                bold:true,color:r[4]==="PASS"?"1A7F37":"C0392B",font:"Arial",size:20})]})]
            })
          ]}))
        ]
      }),
      pb(),

      // 
      // CHAPTER 14 – RESULTS & SCREENS
      // 
      sectionBox("CHAPTER 14 – RESULTS AND OUTPUT ANALYSIS"),
      blank(),
      h1("15. Results and Output Analysis"),
      h2("15.1 System Screens Description"),
      h3("15.1.1 Login Page"),
      p("The login screen presents a centred form card with the ARCHIFY logo, username and password fields rendered via AuthenticationForm, and a submit button. Error messages from form_invalid are displayed inline using Django's messages framework. The LoginView dispatch method ensures authenticated users are bounced directly to their dashboard."),
      h3("15.1.2 Role-Specific Dashboard"),
      p("The dashboard dynamically renders metric cards (Total Projects, Active Projects, Total Workers, Pending Consultations) followed by role-specific panels. A client sees a 'My Recent Projects' table and 'Recent Site Updates' feed. An architect sees 'Assigned Projects' and 'Pending Plan Reviews' count. A contractor sees 'Recent Attendances' and quick-access buttons for attendance marking."),
      h3("15.1.3 Project Detail Page"),
      p("The project detail page is the richest screen in the system. It renders: a project info card (status badge, progress bar, budget vs actual cost, assigned team); a Building Plans panel with plan type icons and version/approval badges; a Milestones timeline with planned vs actual dates and completion indicators; a Site Updates feed with photographs; a Workers panel with attendance status; and a Materials summary with estimated total cost."),
      h3("15.1.4 Attendance Marking Page"),
      p("Presents a data table with one row per active project worker. Each row contains a dropdown for status (Present/Absent/Half Day/Paid Leave), time input fields for check-in/check-out, and a text field for notes. A bulk 'Mark All Present' JavaScript helper improves usability. On submission, the WorkerAttendanceMarkView processes all rows atomically."),
      h3("15.1.5 Monthly Attendance Report"),
      p("The report page displays a summary table with year/month selector controls. Columns include Worker Name, Project, Present Days, Absent Days, Half Days, Paid Leave, Attendance %, Daily Wage, and Total Wage. Footer rows show aggregate totals. An export-to-PDF or print-friendly button can be added via browser print CSS."),
      h2("15.2 Performance Analysis"),
      p("Critical query paths use Django's ORM optimisations: select_related() for FK lookups (e.g., project_workers.select_related('worker')), prefetch_related() for reverse FK sets, and aggregate queries for summary computations. Database indexes on (client, status), (architect, status), (attendance_date, status), and (recipient, is_read) ensure sub-millisecond query times on datasets of thousands of records. Pagination (paginate_by=12 for projects, 20 for attendance) prevents large page renders."),
      pb(),

      // 
      // CHAPTER 15 – ADVANTAGES, LIMITATIONS, FUTURE
      // 
      sectionBox("CHAPTER 15 – ADVANTAGES, LIMITATIONS & FUTURE ENHANCEMENTS"),
      blank(),
      h1("16. Advantages"),
      pi("Unified Platform: All project stakeholders access a single system, eliminating data fragmentation and communication gaps."),
      pi("Role-Based Security: Six distinct roles with enforced queryset and view-level permissions ensure data privacy and operational integrity."),
      pi("Version-Controlled Plans: Automatic version numbering and five-state approval workflow ensure professional document management standards."),
      pi("Digital Payroll: Automated wage computation with attendance-weighted calculations eliminates manual payroll errors."),
      pi("Real-Time Notifications: Eight-category notification system with email/SMS flags supports future omni-channel alerting."),
      pi("Audit Trail: ActivityLog provides a tamper-evident record of all system actions, supporting compliance and dispute resolution."),
      pi("Scalable Architecture: Stateless Django views with database indexing and pagination support horizontal scaling."),
      pi("API-First Extension: REST API layer enables mobile app, third-party, and IoT integration without core changes."),
      pi("Open Source Stack: Zero licensing cost; large community support; no vendor lock-in."),
      blank(),
      h1("17. Limitations"),
      pi("No Real-Time WebSocket Support: Messaging and notifications use polling rather than WebSockets, introducing latency for live updates."),
      pi("No Mobile Application: The system is a responsive web application; a native iOS/Android app would improve field usability."),
      pi("Manual Email/SMS Dispatch: email_sent and sms_sent are flags; actual sending requires integration with Celery, SendGrid, and Twilio."),
      pi("No Financial Integration: Wage payments are recorded manually; integration with UPI or payroll APIs would automate disbursement."),
      pi("No GIS Integration: Site locations are stored as text addresses; map-based site management is absent."),
      pi("Single Tenant: The system is designed as a single-tenant application; multi-tenancy for SaaS deployment would require schema partitioning."),
      blank(),
      h1("18. Future Enhancements"),
      pi("WebSocket Integration (Django Channels): Enable real-time messaging, live notification push, and live site update feeds."),
      pi("Mobile Application: Develop a React Native or Flutter app consuming the DRF API for field workers and site supervisors."),
      pi("Celery + Redis Task Queue: Automate email notifications (SendGrid), SMS alerts (Twilio), and scheduled report generation."),
      pi("GIS and Map Integration: Integrate Google Maps or OpenStreetMap for site location pinning, service area filtering, and site navigation."),
      pi("BIM File Support: Extend BuildingPlan to handle IFC (Industry Foundation Classes) BIM files with in-browser 3D viewing via Three.js or IFC.js."),
      pi("Advanced Analytics Dashboard: Add Chart.js or Recharts-powered dashboards for project cost trends, worker productivity, attendance heat maps, and material usage graphs."),
      pi("AI-Powered Cost Estimation: Integrate a machine learning model trained on historical project data to suggest estimated budgets based on project type, area, and location."),
      pi("Multi-Tenancy / SaaS Mode: Implement organisation-level data isolation to offer ARCHIFY as a multi-tenant SaaS product."),
      pi("Two-Factor Authentication (2FA): Add TOTP-based 2FA for professional and admin accounts."),
      pi("Document E-Signature: Integrate an e-signature workflow for plan approval documents."),
      pb(),

      // 
      // CHAPTER 16 – CONCLUSION
      // 
      sectionBox("CHAPTER 16 – CONCLUSION"),
      blank(),
      h1("19. Conclusion"),
      p("ARCHIFY – Construction Management System represents a comprehensive, production-ready digital platform that successfully addresses the fragmentation and inefficiency challenges inherent in traditional construction project management. Through its carefully designed 26-model relational schema, role-based access control for six user types, modular Django views, and RESTful API layer, ARCHIFY delivers a holistic solution covering the entire construction project lifecycle."),
      blank(),
      p("The system demonstrates sophisticated software engineering practices: UUID primary keys for distributed-system compatibility, abstract model inheritance for schema consistency, database-level indexing for query performance, constraint-based data integrity, automatic building plan version management, weighted wage computation from attendance records, and a structured multi-stage plan approval workflow. The architecture is clean, maintainable, and extensible—a solid foundation for the future enhancements outlined above."),
      blank(),
      p("The successful implementation of ARCHIFY validates the hypothesis that a well-designed, open-source-based web application can meaningfully digitise and improve construction project management for small and medium enterprises. The project fulfils all stated objectives and demonstrates the student team's competency in full-stack web development, database design, software architecture, and domain-specific systems engineering."),
      blank(),
      p("In conclusion, ARCHIFY is not merely a final-year academic exercise but a genuinely deployable, commercially viable system that has the potential to bring measurable efficiency gains to the construction industry—reducing project delays, eliminating payroll errors, improving client transparency, and enabling data-driven decision-making at every level of the project hierarchy."),
      pb(),

      // 
      // REFERENCES
      // 
      h1("References"),
      ni("Django Software Foundation. (2023). Django Documentation (v4.2). https://docs.djangoproject.com/"),
      ni("Encode OSS Ltd. (2023). Django REST Framework Documentation. https://www.django-rest-framework.org/"),
      ni("PostgreSQL Global Development Group. (2023). PostgreSQL 14 Documentation. https://www.postgresql.org/docs/14/"),
      ni("Azhar, S. (2011). Building Information Modeling (BIM): Trends, Benefits, Risks, and Challenges for the AEC Industry. Leadership and Management in Engineering, 11(3), 241–252."),
      ni("Eastman, C., Teicholz, P., Sacks, R., & Liston, K. (2018). BIM Handbook: A Guide to Building Information Modeling (3rd ed.). Wiley."),
      ni("Arayici, Y., et al. (2011). Technology adoption in the BIM implementation for lean architectural practice. Automation in Construction, 20(2), 189–195."),
      ni("Fowler, M. (2018). Patterns of Enterprise Application Architecture. Addison-Wesley Professional."),
      ni("Holovaty, A., & Kaplan-Moss, J. (2009). The Definitive Guide to Django: Web Development Done Right (2nd ed.). Apress."),
      ni("Bootstrap Documentation (v5.3). https://getbootstrap.com/docs/5.3/"),
      ni("Python Software Foundation. (2023). Python 3.10 Documentation. https://docs.python.org/3.10/"),
      pb(),

      // 
      // APPENDIX
      // 
      h1("Appendix"),
      h2("Appendix A – Model Summary Table"),
      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[480,2400,3000,3480],
        rows:[
          new TableRow({children:[hcell("#",480),hcell("Model",2400),hcell("Primary Key",3000),hcell("Key Relationships",3480)]}),
          ...([
            ["1","User","AutoField (int)","1:1 ProfessionalProfile, ClientProfile, Worker"],
            ["2","ProfessionalProfile","UUID","1:1 User"],
            ["3","ClientProfile","UUID","1:1 User"],
            ["4","ProjectCategory","UUID","1:N ConstructionProject"],
            ["5","ConstructionProject","UUID","N:1 User(×4), N:1 ProjectCategory"],
            ["6","BuildingPlan","UUID","N:1 ConstructionProject, N:1 User"],
            ["7","ProjectMilestone","UUID","N:1 ConstructionProject"],
            ["8","SiteUpdate","UUID","N:1 ConstructionProject, N:1 ProjectMilestone"],
            ["9","SiteUpdateImage","UUID","N:1 SiteUpdate"],
            ["10","CCTVCamera","UUID","N:1 ConstructionProject"],
            ["11","Worker","UUID","1:1 User (optional)"],
            ["12","ProjectWorker","UUID","N:1 ConstructionProject, N:1 Worker"],
            ["13","WorkerAttendance","UUID","N:1 ProjectWorker"],
            ["14","WagePayment","UUID","N:1 ProjectWorker"],
            ["15","Material","UUID","1:N ProjectMaterial"],
            ["16","ProjectMaterial","UUID","N:1 ConstructionProject, N:1 Material"],
            ["17","ConsultationRequest","UUID","N:1 User(client), N:1 User(professional)"],
            ["18","Conversation","UUID","N:1 ConstructionProject, 1:1 ConsultationRequest, M:N User"],
            ["19","Message","UUID","N:1 Conversation, N:1 User"],
            ["20","ProjectReview","UUID","1:1 ConstructionProject"],
            ["21","PortfolioProject","UUID","N:1 User, 1:1 ConstructionProject"],
            ["22","PortfolioImage","UUID","N:1 PortfolioProject"],
            ["23","Notification","UUID","N:1 User, N:1 ConstructionProject"],
            ["24","ActivityLog","UUID","N:1 User"]
          ]).map((r,i)=>new TableRow({children:[
            cell(r[0],480,true,i%2===0?HLIGHT:GRAY),
            cell(r[1],2400,true,i%2===0?HLIGHT:GRAY),
            cell(r[2],3000,false,i%2===0?HLIGHT:GRAY),
            cell(r[3],3480,false,i%2===0?HLIGHT:GRAY)
          ]}))
        ]
      }),
      blank(),
      h2("Appendix B – URL Pattern Summary"),
      twoColTable([
        ["/ (home)","Home page – public"],
        ["/login/ , /logout/","Authentication views"],
        ["/register/","Client/professional registration"],
        ["/dashboard/","Role-specific dashboard (login required)"],
        ["/projects/","Project list with search/filter"],
        ["/projects/create/","Create new project (client/admin)"],
        ["/projects/<pk>/","Project detail view"],
        ["/projects/<pk>/update/","Edit project details"],
        ["/projects/<pk>/plans/","List building plans for project"],
        ["/projects/<pk>/plans/upload/","Upload new building plan"],
        ["/projects/<pk>/milestones/","List / create milestones"],
        ["/projects/<pk>/site-updates/","List / post site updates"],
        ["/projects/<pk>/workers/","Project worker assignments"],
        ["/projects/<pk>/attendance/","Attendance list for project"],
        ["/projects/<pk>/attendance/mark/","Mark daily attendance (bulk POST)"],
        ["/projects/<pk>/materials/","Project material list"],
        ["/workers/","Global worker registry"],
        ["/consultations/","Consultation request list"],
        ["/payments/<project_id>/","Wage payment list"],
        ["/notifications/","Notification feed"],
        ["/api/notifications/","JSON API – unread notifications"],
        ["/api/notifications/<id>/read/","JSON API – mark notification read"],
        ["/api/notifications/mark-all-read/","JSON API – mark all read"]
      ]),
      blank(),
      h2("Appendix C – Notification Types Reference"),
      twoColTable([
        ["CONSULTATION_REQUEST","Sent to professional when client submits a consultation request"],
        ["PROJECT_UPDATE","Sent to project participants when a new site update is posted"],
        ["PLAN_APPROVED","Sent to uploaded-by user when a building plan is approved"],
        ["PLAN_REVISION","Sent to professional when plan requires revision"],
        ["WORKER_ATTENDANCE","Sent to contractor/admin when daily attendance is marked"],
        ["WAGE_PAYMENT","Sent to worker when a wage payment is processed"],
        ["NEW_MESSAGE","Sent to conversation participant when a new message arrives"],
        ["CCTV_ALERT","Sent to project stakeholders on CCTV status change or alert"]
      ])

    ] // end children
  }] // end sections
}); // end Document

Packer.toBuffer(doc).then(buf => {
const path = require("path");

Packer.toBuffer(doc).then((buffer) => {
    const outputPath = path.join(__dirname, "ARCHIFY_Project_Report.docx");
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved to: ${outputPath}`);
});  console.log('Report generated successfully.');
}).catch(e => console.error(e));
