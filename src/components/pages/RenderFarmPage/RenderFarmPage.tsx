import ExternalWebviewPageWrapper from "~/components/common/ExternalWebviewPageWrapper";

const RenderFarmPage = (): JSX.Element => (
  <ExternalWebviewPageWrapper
    title="Tractor"
    url={import.meta.env.VITE_TRACTOR_URL}
  />
);

export default RenderFarmPage;
