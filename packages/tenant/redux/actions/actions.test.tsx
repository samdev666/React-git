

import { MetaData } from "../../../../packages/common/models";
import {
    APICALL,
    PAGINATED_APICALL,
    TOKEN_UPDATE,
    TOKEN_REMOVE,
    LOGIN,
    LOGOUT,
    FETCH_BASE_DATA,
    emptyAction,
    action,
    apiRequest,
    paginatedApiRequest,
    updateToken,
    removeToken,
    login,
    logout,
    fetchBaseData,
    PagedApiCall,
  } from "../../redux/actions";
import { HttpMethods } from "@wizehub/common/utils";
  
  describe("Redux Actions", () => {
    it("should create an empty action", () => {
      const expectedAction = { type: "YOUR_TYPE" };
      const resultAction = emptyAction("YOUR_TYPE");
      expect(resultAction).toEqual(expectedAction);
    });
  
    it("should create an action with payload", () => {
      const expectedAction = { type: "YOUR_TYPE", payload: "YOUR_PAYLOAD" };
      const resultAction = action("YOUR_TYPE", "YOUR_PAYLOAD");
      expect(resultAction).toEqual(expectedAction);
    });
  
    it("should create an API request action", () => {
      const expectedAction = {
        type: APICALL,
        payload: {
          request: {
            key: "YOUR_REQUEST_KEY",
            requestProps: {
              endpoint: "YOUR_ENDPOINT",
              method: "YOUR_METHOD",
              payload: "YOUR_PAYLOAD",
              isFormData: undefined,
            },
          },
          success: {},
          failure: {},
        },
      };
      const resultAction = apiRequest(
        {
          request: {
            key: "YOUR_REQUEST_KEY",
            requestProps: {
              endpoint: "YOUR_ENDPOINT",
              method: "YOUR_METHOD",
            },
          },
          success: {},
          failure: {},
        },
        "YOUR_PAYLOAD"
      );
      expect(resultAction).toEqual(expectedAction);
    });
  
    it("should create a paginated API request action", () => {
      const expectedAction = {
        type: PAGINATED_APICALL,
        payload: {
          request: {
            key: "YOUR_KEY",
            endpoint: "YOUR_ENDPOINT",
            filter: {
            },
            loadMore: false,
          },
          update: { action: "YOUR_UPDATE_ACTION" },
          loadMore: { action: "YOUR_LOAD_MORE_ACTION" },
          reset: { action: "YOUR_RESET_ACTION" },
        },
      };
      const resultAction = paginatedApiRequest({
        request: {
          key: "YOUR_KEY",
          endpoint: "YOUR_ENDPOINT",
          filter: {
            
          },
          loadMore: false,
        },
        update: { action: "YOUR_UPDATE_ACTION" },
        loadMore: { action: "YOUR_LOAD_MORE_ACTION" },
        reset: { action: "YOUR_RESET_ACTION" },
      });
      expect(resultAction).toEqual(expectedAction);
    });
  
    it("should create an update token action", () => {
      const expectedAction = {
        type: TOKEN_UPDATE,
        payload: "YOUR_TOKEN",
      };
      const resultAction = updateToken("YOUR_TOKEN");
      expect(resultAction).toEqual(expectedAction);
    });
  
  });
  
  interface YourDataType {
    id: number;
    name: string;
  }

  describe("paginatedApiRequest", () => {
    it("should create a paginated API request action", () => {
      const metaData: MetaData<YourDataType> = {
        order: "",
        direction: "asc",
        total: 10,
        page: 1,
        limit: 10,
        filters: {},
        allowedFilters: ["propertyName"],
      };
  
      const paginatedApi: PagedApiCall<YourDataType> = {
        request: {
          key: "your_key",
          endpoint: "your_endpoint",
          filter: metaData, 
          loadMore: true,
        },
        update: { action: "your_update_action" },
        loadMore: { action: "your_load_more_action" },
        reset: { action: "your_reset_action" },
      };
  
      const action = paginatedApiRequest(paginatedApi);
  
      expect(action).toEqual({
        type: "PAGINATED_APICALL",
        payload: {
          request: {
            key: "your_key",
            endpoint: "your_endpoint",
            filter: metaData,
            loadMore: true,
          },
          update: { action: "your_update_action" },
          loadMore: { action: "your_load_more_action" },
          reset: { action: "your_reset_action" },
        },
      });
    });
  });

  test('fetchBaseData should create an action with type FETCH_BASE_DATA', () => {
    const action = fetchBaseData();
    expect(action.type).toBe(FETCH_BASE_DATA);
  });
  
  test('fetchBaseData should have an empty payload', () => {
    const action = fetchBaseData();
    expect(action.payload).toBeUndefined(); 
  });

  test('logout should create an action with type LOGOUT', () => {
    const action = logout();
    expect(action.type).toBe(LOGOUT);
  });
  
  test('logout should have an empty payload', () => {
    const action = logout();
    expect(action.payload).toBeUndefined(); 
  });

  test('removeToken should create an action with type TOKEN_REMOVE', () => {
    const action = removeToken();
    expect(action.type).toBe(TOKEN_REMOVE);
  });
  
  test('removeToken should have an empty payload', () => {
    const action = removeToken();
    expect(action.payload).toBeUndefined();
  });

