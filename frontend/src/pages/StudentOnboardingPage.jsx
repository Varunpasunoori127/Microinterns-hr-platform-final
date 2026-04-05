import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
}));// (keep your full list here)
const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Non Binary", label: "Non Binary" },
  { value: "Prefer not to say", label: "Prefer not to say" },
  { value: "Other", label: "Other" }
];

export default function StudentOnboardingPage() {

  const { token } = useParams();

  const totalSteps = 10;
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [studentEmail, setStudentEmail] = useState("");
  const loggedUser = JSON.parse(localStorage.getItem("microinterns_user"));
  const displayEmail = studentEmail || loggedUser?.email || "";

  useEffect(() => {
    if (token) {
      fetch(`/students/onboarding/${token}`)
        .then(res => res.json())
        .then(data => setStudentEmail(data.email))
        .catch(() => {});
    }
  }, [token]);

  const [form, setForm] = useState({
    name: "", preferredName: "", email: "",
    phone: "", dob: "",
    nationality: "", gender: "",
    address: "", city: "", postcode: "",
    university: "", course: "", year: "",
    rightToWork: "",
    emergencyName: "", emergencyPhone: "",
    bankName: "", accountNumber: "", sortCode: "",
    file: null,
    confirm: false
  });

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    switch(step){
      case 1: return form.name && displayEmail;
      case 2: return form.dob && form.phone;
      case 3: return form.nationality;
      case 4: return form.address && form.city;
      case 5: return form.university && form.course;
      case 6: return form.rightToWork;
      case 7: return form.emergencyName;
      case 8: return form.bankName && form.accountNumber;
      case 10: return form.confirm;
      default: return true;
    }
  };

  const next = () => {
    if(!validate()) return setError("Please complete required fields *");
    setError("");
    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const submit = () => {
    if(!validate()) return setError("Complete all required fields");
    setSubmitted(true);
  };

  const clearForm = () => {
    setForm({
      name: "", preferredName: "", email: "",
      phone: "", dob: "",
      nationality: "", gender: "",
      address: "", city: "", postcode: "",
      university: "", course: "", year: "",
      rightToWork: "",
      emergencyName: "", emergencyPhone: "",
      bankName: "", accountNumber: "", sortCode: "",
      file: null,
      confirm: false
    });
    setStep(1);
    setError("");
  };

  const progress = (step / totalSteps) * 100;
  const navigate = useNavigate();

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
            <span style={styles.switchAccount}>Switch accounts</span>
          </div>
          <p style={styles.accountText}>
            The name, email address and photo associated with your account will be recorded when you upload files and submit this form
          </p>
        </div>

        <p style={styles.required}>* Indicates required question</p>

        <p style={styles.step}>Step {step} of {totalSteps}</p>

        {error && <p style={styles.error}>{error}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Field label="Full Name *">
              <input
                style={styles.input}
                value={form.name}
                onChange={e => update("name", e.target.value)}
              />
            </Field>

            <Field label="Preferred Name">
              <input
                style={styles.input}
                value={form.preferredName}
                onChange={e => update("preferredName", e.target.value)}
              />
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
              <input
                type="date"
                style={styles.input}
                value={form.dob}
                onChange={e => update("dob", e.target.value)}
              />
            </Field>

            <Field label="Phone Number *">
              <input
                style={styles.input}
                value={form.phone}
                onChange={e => update("phone", e.target.value)}
              />
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
              <input
                style={styles.input}
                value={form.address}
                onChange={e => update("address", e.target.value)}
              />
            </Field>

            <Field label="City *">
              <input
                style={styles.input}
                value={form.city}
                onChange={e => update("city", e.target.value)}
              />
            </Field>

            <Field label="Postcode">
              <input
                style={styles.input}
                value={form.postcode}
                onChange={e => update("postcode", e.target.value)}
              />
            </Field>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <Field label="University *">
              <input
                style={styles.input}
                value={form.university}
                onChange={e => update("university", e.target.value)}
              />
            </Field>

            <Field label="Course *">
              <input
                style={styles.input}
                value={form.course}
                onChange={e => update("course", e.target.value)}
              />
            </Field>

            <Field label="Year of Study">
              <input
                style={styles.input}
                value={form.year}
                onChange={e => update("year", e.target.value)}
              />
            </Field>
          </>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <Field label="Right to Work in UK *">
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="rtw"
                  checked={form.rightToWork === "Yes"}
                  onChange={() => update("rightToWork", "Yes")}
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="rtw"
                  checked={form.rightToWork === "No"}
                  onChange={() => update("rightToWork", "No")}
                /> No
              </label>
            </div>
          </Field>
        )}

        {/* STEP 7 */}
        {step === 7 && (
          <>
            <Field label="Emergency Contact Name *">
              <input
                style={styles.input}
                value={form.emergencyName}
                onChange={e => update("emergencyName", e.target.value)}
              />
            </Field>

            <Field label="Emergency Contact Phone">
              <input
                style={styles.input}
                value={form.emergencyPhone}
                onChange={e => update("emergencyPhone", e.target.value)}
              />
            </Field>
          </>
        )}

        {/* STEP 8 */}
        {step === 8 && (
          <>
            <Field label="Bank Name *">
              <input
                style={styles.input}
                value={form.bankName}
                onChange={e => update("bankName", e.target.value)}
              />
            </Field>

            <Field label="Account Number *">
              <input
                style={styles.input}
                value={form.accountNumber}
                onChange={e => update("accountNumber", e.target.value)}
              />
            </Field>

            <Field label="Sort Code">
              <input
                style={styles.input}
                value={form.sortCode}
                onChange={e => update("sortCode", e.target.value)}
              />
            </Field>
          </>
        )}

        {/* STEP 9 */}
        {step === 9 && (
          <Field label="Upload CV / Passport">
            <input
              type="file"
              onChange={e => update("file", e.target.files[0])}
            />
          </Field>
        )}

        {/* STEP 10 */}
        {step === 10 && (
          <Field label="Confirmation *">
            <label>
              <input
                type="checkbox"
                checked={form.confirm}
                onChange={e => update("confirm", e.target.checked)}
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
              <button style={styles.primary} onClick={submit}>
                Submit
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

/* STYLES */
const styles = {
  container:{background:"#f0ebf8",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"20px 0"},
  form:{background:"white",width:"100%",maxWidth:600,padding:24,borderRadius:8,borderTop:"8px solid #673ab7"},
  title:{fontSize:26},
  desc:{color:"#555",fontSize:14,marginBottom:20},
  step:{color:"#666",marginBottom:10},
  label:{fontWeight:500,marginBottom:6,display:"block"},
  input:{width:"100%",padding:10,border:"1px solid #ccc",borderRadius:4},
  actions:{marginTop:20,display:"flex",gap:10},
  primary:{background:"#673ab7",color:"white",padding:"10px 18px",border:"none",borderRadius:4},
  secondary:{background:"#e5e7eb",padding:"10px 18px",border:"none",borderRadius:4},
  clear:{background:"none",border:"none",color:"#673ab7",cursor:"pointer"},
  error:{color:"red",marginBottom:10},
  progressBar:{height:6,background:"#ddd",marginBottom:15},
  progressFill:{height:6,background:"#673ab7"},
  radioGroup:{display:"flex",gap:20},

  accountBox:{background:"#f1f3f4",border:"1px solid #e0e0e0",borderRadius:8,padding:"12px 16px",margin:"20px 0"},
  accountTop:{display:"flex",justifyContent:"space-between"},
  switchAccount:{color:"#1a73e8",cursor:"pointer"},
  accountText:{fontSize:13,color:"#555"},
  required:{color:"#d93025",marginBottom:10}
};