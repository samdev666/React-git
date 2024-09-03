import { method } from "lodash";
import { apiCall, ping, login } from "./api";
import { config } from "./config";
import { HttpMethods } from "../common/utils";
import * as apiModule from "./api";
import { LOGIN } from "./redux/actions";

describe("apiCall", () => {
  it("should make an API call", async () => {
    const mockData = { data: "mocked data" };

    const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
        headers: new Headers(),
        status: 200,
        statusText: "OK",
        redirected: false,
    } as unknown as Response;

    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

    let response = await apiCall("/mock-endpoint", method(HttpMethods.GET)``, {
      example: "data",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${config.apiHost}/mock-endpoint`,
      {
        body: JSON.stringify({ example: "data" }),
        headers: expect.any(Headers),
        method: "GET",
      }
    );

    response = await response.json();
    expect(response).toEqual({ data: "mocked data" });
  });

  it("should handle errors during login", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Login failed"));
  
    const formData = { username: "invalid", password: "incorrect" };
    try {
      await apiCall(LOGIN, HttpMethods.POST, formData);
      fail("Expected an error");
    } catch (error) {
      expect(error.message).toBe("Login failed");
    }
  });

});
