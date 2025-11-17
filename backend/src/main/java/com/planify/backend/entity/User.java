package com.planify.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String username;
    String password;
    String email;
    String avatar;
    Set<String> roles;

    @Column(columnDefinition = "ENUM('true','false')")
    String notificationenabled;

    @CreatedBy
    Integer created_by;


    @LastModifiedBy
    Integer updated_by;

    @CreatedDate
    LocalDateTime created_date;

    @LastModifiedDate
    LocalDateTime updated_date;

    //mappedBy = "user": Quan hệ này được “quy định” ở field user trong entity UserRole.
    //cascade = CascadeType.ALL : Khi bạn thao tác với User, JPA sẽ tự áp dụng cùng thao tác cho UserRole. Ví dụ: Khi bạn save,delete user: → JPA tự save(),delete() những UserRole mới được thêm vào set.
    //Bạn cần roles ngay lúc login để tạo JWT → BẮT BUỘC PHẢI EAGER. Vì EAGER = luôn lấy role ngay khi load user
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL , fetch = FetchType.EAGER) //1 User -có->  nhiều bản ghi user_role
    Set<UserRole> userRoles = new HashSet<>();
}
