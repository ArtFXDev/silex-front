import ExternalWebviewPageWrapper from "~/components/common/ExternalWebviewPageWrapper";

const HarvestPage = (): JSX.Element => (
  <ExternalWebviewPageWrapper
    title="Harvest"
    url={import.meta.env.VITE_HARVEST_URL}
  />
);

export default HarvestPage;
