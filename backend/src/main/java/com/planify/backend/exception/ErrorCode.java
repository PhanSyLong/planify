package com.planify.backend.exception;

public enum ErrorCode{
    //Khai báo các key
    UNCATEGORIZED_EXCEPTION(1111, "Uncategorized error"),
    INVALID_KEY(1005, "Invalid message key"), //Đây là lỗi viết sai chính tả khi điền các cái này vào message ở Class UserCreationRequest
    USER_EXISTED(1001, "User existed"),
    USERNAME_INVALID(1002, "Username must be at least 3 characters"),
    INVALID_PASSWORD(1003, "Password must be at least 8 characters"),
    USER_NOT_EXISTED(1006, "User not existed"),
    UNAUTHENTICATED(1007, "Unauthenticated"),
    ROLE_NOT_FOUND(1008, "Role not found"),
    USER_ALREADY_EXISTS(1010, "User already exists"),
    FORBIDDEN(1009, "Access denied"),
    UNAUTHORIZED(1011, "You do not have permission to access this resource");

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    //Chỉ cần getter là đủ
    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
