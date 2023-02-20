import { fireEvent, screen, waitFor, within } from "@testing-library/dom";
import { mocked } from "ts-jest/utils";
import { NavNotifications } from "../../../../components/Layout/Header/NavNotifications";
import { useSelector } from "../../../../hooks/useSelector";
import store from '../../../../store/createStore';
import { toBrDate } from "../../../../utils/helpers";
import { renderWithProviders } from "../../../../utils/test-utils";

const dispatchMock = mocked(store.dispatch)
const useSeletorMock = mocked(useSelector)

jest.mock("../../../../store/createStore");
jest.mock("../../../../hooks/useSelector");
jest.mock('broadcast-channel');

const notification = {
  id: "notification-id",
  type: "payables",
  data: {
    id: 111,
    due_date: "01/01/2023",
    description: "description test",
    value: 100,
    is_parcel: "null"

  }
}

describe('NavNotifications Component', () => {
  beforeEach(() => {
    useSeletorMock.mockImplementation(() => ({ isLoading: false, notifications: [notification] }));

    renderWithProviders(<NavNotifications />, {store})
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('renders component correctly', async () => {
    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)
    
    await waitFor(() => {
      const notificationDate = within(screen.getByTestId('notification-date'));
      const notificationDescription = within(screen.getByTestId('notification-description'));


      expect(screen.getByLabelText("Notificações")).toBeInTheDocument();        
      expect(notificationDate.getByText(toBrDate(notification.data.due_date), {exact: false})).toBeInTheDocument()
      expect(notificationDescription.getByText(notification.data.description, {exact: false})).toBeInTheDocument()

      expect(dispatchMock).not.toBeCalled()
    })

  });

  it('marks a notification as read', async () => {
    const notificationIcon = screen.getByRole('button');

    dispatchMock.mockReturnValue({unwrap: () => Promise.resolve()})

    fireEvent.mouseOver(notificationIcon);
    
    await waitFor(async() => {
      const notificationDate = within(screen.getByTestId('notification-date'))
        .getByText(toBrDate(notification.data.due_date), {exact: false});

      fireEvent.click(notificationDate);

      expect(dispatchMock).toBeCalled()
    })
  });

  it('marks all notifications as read', async () => {
    const notificationIcon = screen.getByRole('button');
    
    dispatchMock.mockReturnValue({unwrap: () => Promise.resolve()})
    
    fireEvent.mouseOver(notificationIcon);
    
    await waitFor(async() => {
      const markAllAsReadButton = screen.getByRole('button', {name: "Marcar todas como lidas"})

      fireEvent.click(markAllAsReadButton);
      expect(dispatchMock).toBeCalled()
    })
  });

  it('failed when marks all notifications as read', async () => {
    const notificationIcon = screen.getByRole('button');
    
    const response = {
      response: {
        status: 400,
        headers: {},
        statusText: "",
        config: {},
        data:{
          message: "Error when marks all notification as read"
        }
      }      
    }

    dispatchMock.mockReturnValue({unwrap: () => Promise.reject(response)})
    
    fireEvent.mouseOver(notificationIcon);
    
    await waitFor(() => {
      const markAllAsReadButton = screen.getByRole('button', {name: "Marcar todas como lidas"})

      fireEvent.click(markAllAsReadButton);

      expect(screen.getByText(response.response.data.message)).toBeInTheDocument(); 
      expect(dispatchMock).toBeCalled()
    })
  });
})