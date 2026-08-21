export type LetterFields = {
  date: string;
  honorific: string;
  lastName: string;
  fullName: string;
  title: string;
  organization: string;
  address: string;
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function letterDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function viewRequestLetter(fields: LetterFields) {
  const date = esc(letterDate(fields.date));
  const honorific = esc(fields.honorific.trim());
  const last = esc(fields.lastName.trim());
  const full = esc(fields.fullName.trim());
  const title = esc(fields.title.trim());
  const org = esc(fields.organization.trim());
  const address = esc(fields.address.trim()).replace(/\n/g, "<br>");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Request letter — UMak CCIS Capstone</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 1.25in 1.15in 1.1in;
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.45;
      color: #111;
      background: #fff;
    }
    p { margin: 0 0 1em; max-width: 40rem; }
    .date { margin-bottom: 1.35em; }
    .addr { margin: 0; line-height: 1.35; }
    .addr + .addr { margin-top: 0; }
    .gap { height: 1.1em; }
    .close { margin-top: 1.4em; }
    .sign {
      margin: 2.1em 0 0;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .sign + .sign { margin-top: 1.85em; }
    .role { margin: 0; font-weight: 400; font-size: 11pt; }
    .noted { margin-top: 2.4em; }
    .hint { font-family: "DM Sans", "Segoe UI", sans-serif; font-size: 10pt; color: #555; }
    @media print {
      body { padding: 0.7in 0.9in; }
      .hint { display: none; }
    }
  </style>
</head>
<body>
  <p class="hint">Print this page → Save as PDF. Then close the tab.</p>
  <p class="date">${date}</p>
  <p class="addr"><strong>${full}</strong></p>
  <p class="addr">${title}</p>
  <p class="addr">${org}</p>
  <p class="addr">${address}</p>
  <div class="gap"></div>
  <p>Dear ${honorific} ${last},</p>
  <p>We are students from the University of Makati — College of Computing and Information Sciences, currently pursuing a Bachelor of Science in Information Technology, Information and Network Security Track. As part of our academic requirements in Capstone Project and Research 1, we are undertaking a research initiative that aims to explore opportunities for enhancing IT systems and strengthening network infrastructure.</p>
  <p>In this regard, we would like to formally request the opportunity to study the existing systems and network operational infrastructure of ${org}. This will allow us to gather relevant data, conduct an assessment, and propose solutions aligned with modern security standards and industry best practices. We believe this collaboration will not only support our academic growth but also provide valuable insights that may benefit your organization.</p>
  <p>Please be assured that all information gathered will be treated with the highest confidentiality and used solely for academic purposes. We are more than willing to arrange a meeting at your convenience to discuss the details of this project. Should you have any questions or require further information, please feel free to contact us at lcorpuz.k12149953@umak.edu.ph or 0962-298-2327.</p>
  <p>We look forward to the possibility of working together in this mutually beneficial academic endeavor. Thank you for your time and consideration.</p>
  <p class="close">Respectfully yours,</p>
  <p class="sign">Lance Josh M. Corpuz<br><span class="role">Point of contact</span></p>
  <p class="sign">Jhorenz S. Camarador</p>
  <p class="sign">Justin Mark B. Luzano</p>
  <p class="noted">Noted by:</p>
  <p class="addr">&nbsp;</p>
  <p class="addr">________________________________</p>
  <p class="role">Adviser</p>
  <script>window.addEventListener("load", () => setTimeout(() => window.print(), 250));</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, "_blank", "noopener");
  if (!tab) {
    URL.revokeObjectURL(url);
    return;
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
