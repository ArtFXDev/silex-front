const HarvestPage = (): JSX.Element => {
  return (
    <iframe
      title="Harvest"
      width="100%"
      height="100%"
      src={import.meta.env.VITE_HARVEST_URL}
      style={{ height: "100vh", border: "0px" }}
    ></iframe>
  );
};

export default HarvestPage;
