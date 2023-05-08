import ExternalWebviewPageWrapper from "~/components/common/ExternalWebviewPageWrapper";

const TicketPage = (): JSX.Element => (
  <ExternalWebviewPageWrapper
    title="Ticket"
    url={import.meta.env.VITE_TICKET_URL}
  />
);

export default TicketPage;
