const TractorPage = (): JSX.Element => {
  return (
    <iframe
      title="Tractor"
      width="100%"
      height="100%"
      src={process.env.REACT_APP_TRACTOR_URL}
      frameBorder="0"
      style={{ height: "100vh" }}
    ></iframe>
  );
};

export default TractorPage;
