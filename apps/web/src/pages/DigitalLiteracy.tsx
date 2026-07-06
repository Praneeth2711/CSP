import React, { useState } from "react";
import { Mail, ShieldCheck, FileUp, Key, BookOpen, ExternalLink, HelpCircle, CheckSquare } from "lucide-react";
import { Card, Badge, Button } from "@empowerrural/ui";

interface GuideStep {
  title: string;
  desc: string;
}

interface LiteracyGuide {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  prerequisites: string[];
  steps: GuideStep[];
  portal_link?: string;
  portal_label?: string;
}

export const DigitalLiteracy: React.FC = () => {
  const [activeGuideId, setActiveGuideId] = useState("email");
  const [checkedPreReqs, setCheckedPreReqs] = useState<{ [key: string]: boolean }>({});

  const guides: LiteracyGuide[] = [
    {
      id: "email",
      title: "Create a Google Email (Gmail)",
      desc: "An active email address is required to apply for jobs online, register on government portals, and receive interview call letters.",
      icon: <Mail className="w-5 h-5" />,
      prerequisites: [
        "A working mobile phone to receive verification SMS",
        "A piece of paper and pen to write down your password safely"
      ],
      steps: [
        { title: "Go to Gmail Website", desc: "Open your browser and navigate to accounts.google.com/signup." },
        { title: "Enter Personal Details", desc: "Type your First Name, Last Name, and choose a unique username (e.g. ramesh.kumar2026)." },
        { title: "Create a Strong Password", desc: "Use a mix of letters, numbers, and symbols. Write it down and keep it in a safe place." },
        { title: "Verify Mobile Number", desc: "Enter your mobile phone number. You will receive an SMS containing a 6-digit verification code. Type that code into the screen." },
        { title: "Complete setup", desc: "Agree to privacy rules. You can now use your email address to sign in anywhere." }
      ],
      portal_link: "https://accounts.google.com/signup",
      portal_label: "Gmail Signup Portal"
    },
    {
      id: "digilocker",
      title: "Access Documents via DigiLocker",
      desc: "DigiLocker is a secure government cloud wallet where you can store official documents like school marks sheets, caste certificates, and driving licenses.",
      icon: <ShieldCheck className="w-5 h-5" />,
      prerequisites: [
        "Aadhaar Card number",
        "Mobile phone linked with Aadhaar to receive OTP checks"
      ],
      steps: [
        { title: "Download DigiLocker App / Open Website", desc: "Search for 'DigiLocker' on the Play Store or go to digilocker.gov.in." },
        { title: "Click 'Sign Up'", desc: "Enter your Aadhaar number, full name matching Aadhaar, date of birth, and gender." },
        { title: "Enter OTP Verification", desc: "Type the OTP sent to your Aadhaar-linked mobile phone number." },
        { title: "Set 6-Digit Security PIN", desc: "Create a 6-digit pin to lock your wallet. Do not share this pin with anyone." },
        { title: "Retrieve Certificates", desc: "Go to 'Issued Documents', select your school board, type your roll number, and pull your digital marks card." }
      ],
      portal_link: "https://www.digilocker.gov.in/",
      portal_label: "DigiLocker Official Portal"
    },
    {
      id: "upload",
      title: "Resizing & Uploading Documents",
      desc: "Most job portals require uploading passport photos and certificates in files smaller than 2MB. Learn how to convert and scale them.",
      icon: <FileUp className="w-5 h-5" />,
      prerequisites: [
        "A clear smartphone photo of your certificate/passport photo",
        "Access to a computer or mobile image resizing website"
      ],
      steps: [
        { title: "Take a Clear Photo", desc: "Place your certificate on a flat surface with good lighting. Hold your phone flat to avoid shadows." },
        { title: "Check File Size", desc: "Go to your phone gallery, click file details. If it is larger than 2MB, it will be rejected by most portals." },
        { title: "Use Online Resizer", desc: "Open websites like 'ilovepdf.com' or 'compressjpeg.com' in your browser." },
        { title: "Compress Photo", desc: "Upload your photo, set quality to 'Medium' (about 300KB), and hit Compress." },
        { title: "Download & Save", desc: "Download the compressed file. Rename it clearly (e.g. Ramesh_10th_Marksheet.jpg) for easy uploading." }
      ]
    },
    {
      id: "aadhaar",
      title: "Aadhaar Services & Mobile Linking",
      desc: "Verify if your active mobile phone number is linked with your Aadhaar card to authenticate OTPs for government portals.",
      icon: <Key className="w-5 h-5" />,
      prerequisites: [
        "Aadhaar Card number",
        "Active mobile number"
      ],
      steps: [
        { title: "Go to UIDAI portal", desc: "Visit resident.uidai.gov.in." },
        { title: "Click 'Verify Email/Mobile Number'", desc: "Type your 12-digit Aadhaar number and the mobile number you want to check." },
        { title: "Receive status", desc: "If the screen says 'The Mobile number matches', it is linked. If not, you must visit a local Aadhaar Seva Kendra." },
        { title: "Visit local center if needed", desc: "Locate nearest Aadhaar Center in your Gram Panchayat. Submit a biometric update form (takes 24-48 hours)." }
      ],
      portal_link: "https://resident.uidai.gov.in/",
      portal_label: "UIDAI Resident Services"
    }
  ];

  const activeGuide = guides.find(g => g.id === activeGuideId) || guides[0];

  const togglePreReq = (preKey: string) => {
    setCheckedPreReqs(prev => ({ ...prev, [preKey]: !prev[preKey] }));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Digital Literacy Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Step-by-step guides showing how to register for emails, scan documentation, and use digital lockers.</p>
      </div>

      {/* Guide selection tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {guides.map(g => (
          <button
            key={g.id}
            onClick={() => { setActiveGuideId(g.id); setCheckedPreReqs({}); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
              activeGuideId === g.id
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
            }`}
          >
            {g.icon}
            <span>{g.title}</span>
          </button>
        ))}
      </div>

      {/* Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary & Prerequisites checklist */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-slate-100 space-y-4">
            <div className="space-y-2">
              <Badge variant="success">GUIDE MODULE</Badge>
              <h2 className="text-xl font-extrabold text-slate-850 dark:text-white leading-snug">{activeGuide.title}</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{activeGuide.desc}</p>
            </div>

            {/* Checklist */}
            <div className="pt-4 border-t space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Before You Begin Checklist:</h3>
              <div className="space-y-2.5">
                {activeGuide.prerequisites.map((pre, idx) => {
                  const itemKey = `${activeGuide.id}-${idx}`;
                  const isChecked = !!checkedPreReqs[itemKey];
                  return (
                    <button
                      key={idx}
                      onClick={() => togglePreReq(itemKey)}
                      className="flex items-start text-left w-full text-xs font-semibold text-slate-650"
                    >
                      <CheckSquare className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${
                        isChecked ? "text-emerald-600 fill-emerald-50" : "text-slate-300"
                      }`} />
                      <span className={isChecked ? "line-through text-slate-400" : ""}>{pre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Stepper Walkthrough */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-6">Step-by-Step Instructions</h3>
            
            <div className="relative border-l border-slate-200 dark:border-slate-700 ml-4 space-y-8">
              {activeGuide.steps.map((step, index) => (
                <div key={index} className="relative pl-8">
                  <span className="absolute -left-4 top-1.5 flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 bg-white text-xs font-bold text-slate-850 dark:border-slate-600 dark:bg-slate-850 dark:text-white">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">{step.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {activeGuide.portal_link && (
              <div className="flex justify-end pt-6 border-t mt-6">
                <a href={activeGuide.portal_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 flex items-center">
                    {activeGuide.portal_label || "Visit Portal"}
                    <ExternalLink className="w-4 h-4 ml-1.5" />
                  </Button>
                </a>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};
