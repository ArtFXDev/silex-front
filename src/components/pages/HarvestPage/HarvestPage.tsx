const HarvestPage = (): JSX.Element => {
  return (
    <iframe
      title="Harvest"
      width="100%"
      height="100%"
      src={process.env.REACT_APP_HARVEST_URL}
      frameBorder="0"
      style={{ height: "100vh" }}
    ></iframe>
  );
};

export default HarvestPage;
