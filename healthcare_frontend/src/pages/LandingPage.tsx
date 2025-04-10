const LandingPage = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-sky-100 to-medical-primary">
      <h1>Welcome to the Healthcare App</h1>
      <p>Your health, our priority.</p>
      <div className="flex">
        <button className="border border-white bg-medical-primary text-white rounded-md hover:bg-cyan-800 transition py-2 px-4 mr-4" onClick={() => window.location.href = '/patient-auth'}>
          login as patient
        </button>
        <button className="border border-white bg-medical-primary text-white rounded-md hover:bg-cyan-800 transition py-2 px-4" onClick={() => window.location.href = '/doctor-auth'}>
          login as doctor
        </button>
      </div>
    </div>
    </>
  );
}
export default LandingPage;