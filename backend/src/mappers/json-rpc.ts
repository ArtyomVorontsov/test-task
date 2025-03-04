import { JsonRpcResponse } from "../types"

const makeJsonRPCResponse = <T>(body: T): JsonRpcResponse<T> => {
    return {
        result: body
    }
}

export {
    makeJsonRPCResponse
}