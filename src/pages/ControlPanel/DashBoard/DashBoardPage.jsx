import Logo from "../../../assets/images/medb-logo-png.png";

const DashBoardPage = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl p-8 w-screen justify-center">
        <img
          src={Logo}
          alt="MedB Logo"
          className="w-32 h-32 object-contain"
        />
        <h1 className="text-3xl font-bold text-primary">Welcome to MedB!</h1>
        <p className="text-lg text-muted-foreground">
          We're glad to have you here. MedB is your trusted platform for healthcare needs — all in one place.
        </p>
        <p className="text-sm text-gray-500">Use the menu on the left to get started.</p>
      </div>
    </section>
  );
};

export default DashBoardPage;
