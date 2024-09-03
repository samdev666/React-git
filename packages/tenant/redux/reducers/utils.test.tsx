import {
    createBasicReducer,
    createPagedReducer,
  } from "../../redux/reducers/utils";
  
  describe("Basic Reducer", () => {
    it("should handle UPDATE action", () => {
      const key = "EXAMPLE";
      const initialState = { exampleProp: "initialValue" };
      const reducer = createBasicReducer(key, initialState);
  
      const action = {
        type: `${key}_UPDATE`,
        payload: { exampleProp: "updatedValue" },
      };
  
      const newState = reducer(undefined, action);
      expect(newState).toEqual({ exampleProp: "updatedValue" });
    });
  
    it("should handle UPDATE action with payload as array", () => {
      const key = "EXAMPLE";
      const initialState = [{ exampleProp: "initialValue" }];
      const reducer = createBasicReducer(key, initialState);
  
      const action = {
        type: `${key}_UPDATE`,
        payload: [{ exampleProp: "updatedValue" }],
      };
  
      const newState = reducer(undefined, action);
      expect(newState).toEqual([{ exampleProp: "updatedValue" }]);
    });
  
    it("should handle UPDATE action with payload as data type other than object", () => {
      const key = "EXAMPLE";
      const initialState = 69;
      const reducer = createBasicReducer(key, initialState);
  
      const action = {
        type: `${key}_UPDATE`,
        payload: 96,
      };
  
      const newState = reducer(undefined, action);
      expect(newState).toEqual(96);
    });
  
    // it("should handle RESET action", () => {
    //   const key = "EXAMPLE";
    //   const initialState = { exampleProp: "initialValue" };
    //   const reducer = createBasicReducer(key, initialState);
  
    //   const action = {
    //     type: `${key}_RESET`,
    //   };
  
    //   const newState = reducer({ exampleProp: "updatedValue" }, action);
    //   expect(newState).toEqual(initialState);
    // });
  
    // it("should handle wrong actions with default returns", () => {
    //   const key = "EXAMPLE";
    //   const initialState = { exampleProp: "initialValue" };
    //   const reducer = createBasicReducer(key, initialState);
  
    //   const action = {
    //     type: `${key}sdfsdfdsf`,
    //   };
  
    //   const newState = reducer({ exampleProp: "updatedValue" }, action);
    //   expect(newState).toEqual({ exampleProp: "updatedValue" });
    // });
  });
  
  describe("Paged Reducer", () => {
    it("should handle PAGINATION_UPDATE action", () => {
      const key = "EXAMPLE";
      const initialEntity = [{ id: 1, name: "Entity 1" }];
      const reducer = createPagedReducer(key, initialEntity);
  
      const action = {
        type: `${key}_PAGINATION_UPDATE`,
        payload: {
          metadata: {
            totalCount: 1,
            page: 1,
            pageSize: 10,
          },
          records: [{ id: 2, name: "Entity 2" }],
        },
      };
  
      const newState = reducer(undefined, action);
  
      expect(newState.metadata).toEqual({
        totalCount: 1,
        page: 1,
        pageSize: 10,
      });
  
      expect(newState.records).toEqual([{ id: 2, name: "Entity 2" }]);
      expect(newState.requestDate).toEqual(expect.any(Date));
    });
  
    it("should handle PAGINATION_LOAD_MORE action", () => {
      const key = "EXAMPLE";
      const initialEntity = [{ id: 1, name: "Entity 1" }];
      const reducer = createPagedReducer(key, initialEntity);
  
      const action = {
        type: `${key}_PAGINATION_LOAD_MORE`,
        payload: {
          metadata: {
            totalCount: 2,
            page: 2,
            pageSize: 10,
          },
          records: [{ id: 2, name: "Entity 2" }],
        },
      };
  
      const loadMoreState = {
        metadata: {},
        records: [
          {
            id: 69,
            name: "Maskman",
          },
        ],
      };
  
      const newState = reducer(loadMoreState, action);
  
      expect(newState.metadata).toEqual({
        totalCount: 2,
        page: 2,
        pageSize: 10,
      });
  
      expect(newState.records).toEqual([
        { id: 69, name: "Maskman" },
        { id: 2, name: "Entity 2" },
      ]);
      expect(newState.requestDate).toEqual(expect.any(Date));
    });
  
    it("should handle PAGINATION_RESET action", () => {
      const key = "EXAMPLE";
      const initialEntity = [{ id: 1, name: "Entity 1" }];
      const reducer = createPagedReducer(key, initialEntity);
  
      const action = {
        type: `${key}_PAGINATION_RESET`,
      };
  
      const newState = reducer({}, action);
  
      expect(newState.metadata).toEqual({
        order: "",
        direction: "asc",
        total: 0,
        page: 1,
        limit: 10,
        filters: {},
        allowedFilters: [],
      });
  
      expect(newState.records).toEqual([{ id: 1, name: "Entity 1" }]);
    });
  
    it("should handle default case incase of wrong action dispatch", () => {
      const key = "EXAMPLE";
      const reducer = createPagedReducer(key, [{ id: 1, name: "tester" }]);
  
      const action = {
        type: "randfsdlfd",
      };
  
      const newState = reducer(undefined, action);
  
      expect(newState.metadata).toEqual({
        order: "",
        direction: "asc",
        total: 0,
        page: 1,
        limit: 10,
        filters: {},
        allowedFilters: [],
      });
  
      expect(newState.records).toEqual([{ id: 1, name: "tester" }]);
    });
  });