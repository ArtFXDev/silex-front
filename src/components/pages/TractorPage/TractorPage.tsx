const TractorPage = (): JSX.Element => {
  return (
    <iframe
      title="Tractor"
      width="100%"
      height="100%"
      src={import.meta.env.VITE_TRACTOR_URL}
      style={{ height: "100vh", border: "0px" }}
    ></iframe>
  );
};

export default TractorPage;
