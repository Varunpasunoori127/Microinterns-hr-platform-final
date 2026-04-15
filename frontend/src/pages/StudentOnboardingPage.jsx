import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";

/* KEEP YOUR FULL COUNTRY LIST HERE */
const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
  "Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
  "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China",
  "Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
  "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",
  "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles",
  "Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe"
];

const countryOptions = countries.map(country => ({
  value: country,
  label: country
}));

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Non Binary", label: "Non Binary" },
  { value: "Prefer not to say", label: "Prefer not to say" },
  { value: "Other", label: "Other" }
];

export default function StudentOnboardingPage() {

  const { token } = useParams();
  const navigate = useNavigate();

  const totalSteps = 10;
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [studentEmail, setStudentEmail] = useState("");

  const loggedUser = JSON.parse(localStorage.getItem("microinterns_user"));
  const displayEmail = studentEmail || loggedUser?.email || "";

  const API_URL = import.meta.env.VITE_API_URL 

  /* ================= FETCH TOKEN ================= */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/students/onboarding/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();

          if (text.includes("expired") || text.includes("Invalid")) {
            navigate(`/skills/${token}`);
            return null;
          }

          throw new Error("Something went wrong");
        }

        return res.json();
      })
      .then((data) => {
        if (data) setStudentEmail(data.email);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token, navigate]);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    name: "",
    preferredName: "",
    email: "",
    phone: "",
    dob: "",
    nationality: "",
    gender: "",

    address: "",
    city: "",
    postcode: "",

    university: "",
    course: "",
    year: "",
    educationDetails: "",

    rightToWork: "",
    workExperience: "",

    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    nationalIdNumber: "",
    passportNumber: "",

    bankName: "",
    bankAccountNumber: "",
    sortCode: "",
    ifscCode: "",

    agreementAccepted: false
  });

  /* ================= FIX 1: UPDATE FUNCTION ================= */
  const update = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    switch(step){

      case 1:
        return form.name && displayEmail;

      case 2:
        return form.dob && /^\d{10,15}$/.test(form.phone);

      case 3:
        return form.nationality && form.gender; // gender optional

      case 4:
        return form.address && form.city && form.postcode;

      case 5:
        return form.university && form.course && form.year;

      case 6:
        return form.rightToWork; //work experience optional

      case 7:
        return form.emergencyContactName && form.emergencyContactPhone && form.emergencyContactRelation;

      case 8:
        return form.nationalIdNumber && form.passportNumber;

      case 9:
     return (
     form.bankName?.trim() !== "" &&
     /^\d{6,12}$/.test(form.bankAccountNumber) &&
     /^\d{6}$/.test(form.sortCode?.replace(/-/g, "")) &&
     (
      !form.ifscCode || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.toUpperCase())
     )
   );

      case 10:
        return form.agreementAccepted;

      default:
        return true;
    }
  };
  

  /* ================= NAV ================= */
  const next = () => {
    if(!validate()) return setError("Please complete required fields *");
    setError("");
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => setStep(step - 1);

  /* ================= SUBMIT ================= */
  const submit = async () => {

  if (!validate()) return setError("Complete all required fields");

  if (!displayEmail) {
    setError("Email missing. Please login again.");
    return;
  }

  try {
    setLoading(true);

    // 🔥 build final payload
    const payload = {
      ...form,
      email: displayEmail   // ✅ VERY IMPORTANT (ensures email is sent)
    };

    console.log("SUBMITTING:", payload); // debug

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/students/onboarding/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"   // ✅ FIXES 415 ERROR
        },
        body: JSON.stringify(payload)          // ✅ SEND JSON
      }
    );

    if (!res.ok) throw new Error("Submission failed");

    const data = await res.json();
    console.log("SUCCESS:", data);

    // ✅ move to next step
    setSubmitted(true);    // or navigate(`/skills/${token}`)

  } catch (err) {
    console.error(err);
    setError("Submission failed");
  } finally {
    setLoading(false);
  }
};
  
  /* ================= CLEAR ================= */
  const clearForm = () => {
    setForm({
      name: "",
      preferredName: "",
      phone: "",
      dob: "",
      nationality: "",
      gender: "",
      address: "",
      city: "",
      postcode: "",
      university: "",
      course: "",
      year: "",
      educationDetails: "",
      rightToWork: "",
      workExperience: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      nationalIdNumber: "",
      passportNumber: "",
      bankName: "",
      bankAccountNumber: "",
      sortCode: "",
      ifscCode: "",
      agreementAccepted: false
    });

    setStep(1);
    setError("");
  };

  const progress = (step / totalSteps) * 100;

  /* ================= SUCCESS ================= */
  if(submitted){
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <h2>✅ Onboarding Complete</h2>

          <p>Your details have been recorded successfully.</p>

          <button
            style={styles.primary}
            onClick={() => navigate(`/skills/${token}`)}
          >
            Add Your Skills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        {/* PROGRESS */}
<div style={styles.progressBar}>
  <div style={{ ...styles.progressFill, width: `${progress}%` }} />
</div>

<h1 style={styles.title}>MicroInterns Onboarding Form</h1>

<p style={styles.desc}>
  Welcome to MicroInterns! 🎉 <br /><br />
  Please complete this onboarding form to help us set up your internship placement.<br />
  You’ll need approximately <b>10 minutes</b> and a copy of your <b>right-to-work document</b>.<br />
  All data will be processed securely under GDPR regulations.
</p>

        
        {/* ACCOUNT BOX */}
        <div style={styles.accountBox}>
          <div style={styles.accountTop}>
            <span style={{ fontWeight: 600 }}>{displayEmail}</span>
            <span
              style={styles.switchAccount}
              onClick={() => {
                localStorage.removeItem("microinterns_user");
                window.location.href = "/";
              }}
            >
              Switch accounts
            </span>
          </div>
        </div>

        <p style={styles.step}>Step {step} of {totalSteps}</p>
        {error && <p style={styles.error}>{error}</p>}

        {/* ================= ALL YOUR STEPS (UNCHANGED) ================= */}

        {/* STEP 1 */}
{step === 1 && (
  <>
    <Field label="Full Name *">
      <input style={styles.input} value={form.name} onChange={e => update("name", e.target.value)} />
    </Field>

    <Field label="Preferred Name">
      <input style={styles.input} value={form.preferredName} onChange={e => update("preferredName", e.target.value)} />
    </Field>

    <Field label="Email *">
      <input style={styles.input} value={displayEmail} readOnly />
    </Field>
  </>
)}

{/* STEP 2 */}
{step === 2 && (
  <>
    <Field label="Date of Birth *">
      <input type="date" style={styles.input} value={form.dob} onChange={e => update("dob", e.target.value)} />
    </Field>

    <Field label="Phone Number *">
      <input style={styles.input} value={form.phone} onChange={e => update("phone", e.target.value)} />
    </Field>
  </>
)}

{/* STEP 3 */}
{step === 3 && (
  <>
    <Field label="Nationality *">
      <Select
        options={countryOptions}
        value={countryOptions.find(o => o.value === form.nationality)}
        onChange={o => update("nationality", o.value)}
      />
    </Field>

    <Field label="Gender">
      <Select
        options={genderOptions}
        value={genderOptions.find(o => o.value === form.gender)}
        onChange={o => update("gender", o.value)}
      />
    </Field>
  </>
)}

{/* STEP 4 */}
{step === 4 && (
  <>
    <Field label="Address *">
      <input style={styles.input} value={form.address} onChange={e => update("address", e.target.value)} />
    </Field>

    <Field label="City *">
      <input style={styles.input} value={form.city} onChange={e => update("city", e.target.value)} />
    </Field>

    <Field label="Postcode *">
      <input style={styles.input} value={form.postcode} onChange={e => update("postcode", e.target.value)} />
    </Field>
  </>
)}

{/* STEP 5 */}
{step === 5 && (
  <>
    <Field label="University *">
      <input style={styles.input} value={form.university} onChange={e => update("university", e.target.value)} />
    </Field>

    <Field label="Course *">
      <input style={styles.input} value={form.course} onChange={e => update("course", e.target.value)} />
    </Field>

    <Field label="Year of Study">
      <input style={styles.input} value={form.year} onChange={e => update("year", e.target.value)} />
    </Field>

    <Field label="Education Details">
      <input style={styles.input} value={form.educationDetails} onChange={e => update("educationDetails", e.target.value)} />
    </Field>
  </>
)}

{/* STEP 6 */}
{step === 6 && (
  <>
    <Field label="Right to Work in UK *">
      <div style={styles.radioGroup}>
        <label>
          <input type="radio" checked={form.rightToWork === "Yes"} onChange={() => update("rightToWork", "Yes")} /> Yes
        </label>
        <label>
          <input type="radio" checked={form.rightToWork === "No"} onChange={() => update("rightToWork", "No")} /> No
        </label>
      </div>
    </Field>

    <Field label="Work Experience">
      <input style={styles.input} value={form.workExperience} onChange={e => update("workExperience", e.target.value)} />
    </Field>
  </>
)}

{/* STEP 7 */}
{step === 7 && (
  <>
    <Field label="Emergency Contact Name *">
      <input style={styles.input} value={form.emergencyContactName} onChange={e => update("emergencyContactName", e.target.value)} />
    </Field>

    <Field label="Emergency Contact Phone *">
      <input style={styles.input} value={form.emergencyContactPhone} onChange={e => update("emergencyContactPhone", e.target.value)} />
    </Field>

    <Field label="Relation">
      <input style={styles.input} value={form.emergencyContactRelation} onChange={e => update("emergencyContactRelation", e.target.value)} />
    </Field>
  </>
)}

{/* STEP 8 */}
{step === 8 && (
  <>
    <Field label="National ID Number">
      <input style={styles.input} value={form.nationalIdNumber} onChange={e => update("nationalIdNumber", e.target.value)} />
    </Field>

    <Field label="Passport Number">
      <input style={styles.input} value={form.passportNumber} onChange={e => update("passportNumber", e.target.value)} />
    </Field>
  </>
)}

{/* STEP 9 */}
{step === 9 && (
  <>
    <Field label="Bank Name *">
      <input style={styles.input} value={form.bankName} onChange={e => update("bankName", e.target.value)} />
    </Field>

    <Field label="Account Number *">
      <input style={styles.input} value={form.bankAccountNumber} onChange={e => update("bankAccountNumber", e.target.value)} />
    </Field>

    <Field label="Sort Code *">
      <input style={styles.input} value={form.sortCode} onChange={e => update("sortCode", e.target.value)} />
    </Field>

    <Field label="IFSC Code">
      <input style={styles.input} value={form.ifscCode} onChange={e => update("ifscCode", e.target.value)} />
    </Field>
  </>
)}

{/* STEP 10 */}
{step === 10 && (
  <Field label="Confirmation *">
    <label>
      <input
        type="checkbox"
        checked={form.agreementAccepted}
        onChange={e => update("agreementAccepted", e.target.checked)}
      />
      I confirm all information is correct
    </label>
  </Field>
)}
{/* BUTTONS */}
<div style={{ ...styles.actions, justifyContent: "space-between" }}>

  <div>
    {step > 1 && (
      <button style={styles.secondary} onClick={back}>
        Back
      </button>
    )}

    {step < totalSteps && (
      <button style={styles.primary} onClick={next}>
        Next
      </button>
    )}

    {step === totalSteps && (
      <button style={styles.primary} onClick={submit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    )}
  </div>

  <button onClick={clearForm} style={styles.clear}>
    Clear form
  </button>

</div>

      </div>
    </div>
  );
}


/* FIELD */
function Field({label, children}){
  return (
    <div style={{marginBottom:20}}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

/* STYLES — KEEP YOUR ORIGINAL */


/* STYLES */
const styles = {
  container:{
    background:"#f3f4f6",
    minHeight:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"flex-start",
    padding:"40px 0"
  },

  form:{
    background:"white",
    width:"100%",
    maxWidth:750,
    padding:28,
    borderRadius:12,
    boxShadow:"0 10px 30px rgba(0,0,0,0.08)"
  },

  title:{
    fontSize:26,
    fontWeight:700,
    marginBottom:10
  },

  desc:{
    color:"#6b7280",
    fontSize:14,
    marginBottom:20,
    lineHeight:1.6
  },

  step:{
    color:"#6b7280",
    marginBottom:10,
    fontWeight:500
  },

  label:{
    fontWeight:600,
    marginBottom:6,
    display:"block",
    fontSize:14
  },

  input:{
    width:"100%",
    padding:"12px",
    border:"1px solid #d1d5db",
    borderRadius:6,
    fontSize:14,
    outline:"none",
    transition:"0.2s",
  },

  actions:{
    marginTop:25,
    display:"flex",
    gap:10,
    alignItems:"center"
  },

  primary:{
    background:"#673ab7",
    color:"white",
    padding:"10px 22px",
    border:"none",
    borderRadius:6,
    fontWeight:600,
    cursor:"pointer",
    boxShadow:"0 2px 6px rgba(0,0,0,0.1)",
    transition:"0.2s"
  },

  secondary:{
  background:"#e5e7eb",
  color:"#111827",           // 🔥 ADD THIS (text color)
  padding:"10px 22px",
  border:"1px solid #d1d5db", // 🔥 ADD BORDER
  borderRadius:6,
  fontWeight:500,
  cursor:"pointer"
 },

  clear:{
    background:"none",
    border:"none",
    color:"#673ab7",
    fontWeight:500,
    cursor:"pointer"
  },

  error:{
    color:"#dc2626",
    marginBottom:10,
    fontSize:13
  },

  progressBar:{
    height:6,
    background:"#e5e7eb",
    marginBottom:20,
    borderRadius:10,
    overflow:"hidden"
  },

  progressFill:{
    height:6,
    background:"#673ab7",
    transition:"0.3s"
  },

  radioGroup:{
    display:"flex",
    gap:25,
    marginTop:5
  },

  accountBox:{
    background:"#f9fafb",
    border:"1px solid #e5e7eb",
    borderRadius:10,
    padding:"14px 16px",
    margin:"20px 0"
  },

  accountTop:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
  },

  switchAccount:{
    color:"#2563eb",
    cursor:"pointer",
    fontSize:13,
    fontWeight:500
  },

  accountText:{
    fontSize:13,
    color:"#6b7280",
    marginTop:5
  },

  required:{
    color:"#dc2626",
    marginBottom:10,
    fontSize:13
  },

  topStats:{
    display:"flex",
    justifyContent:"space-between",
    background:"#f9fafb",
    padding:16,
    borderRadius:10,
    marginBottom:20,
    border:"1px solid #e5e7eb"
  }
};