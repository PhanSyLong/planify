package com.planify.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name="user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "username", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String username;

    String password;
    String email;
    String avatar;

    @Column(name="notificationenabled", columnDefinition = "ENUM('true', 'false')")
    String notification_enabled;

    @CreatedBy
    Integer created_by;

    @LastModifiedBy
    Integer updated_by;

    @CreatedDate
    LocalDateTime created_date;

    @LastModifiedDate
    LocalDateTime updated_date;
    int status;

    //mappedBy = "user": Quan hệ này được “quy định” ở field user trong entity UserRole.
    //cascade = CascadeType.ALL : Khi bạn thao tác với User, JPA sẽ tự áp dụng cùng thao tác cho UserRole. Ví dụ: Khi bạn save,delete user: → JPA tự save(),delete() những UserRole mới được thêm vào set.
    //Bạn cần roles ngay lúc login để tạo JWT → BẮT BUỘC PHẢI EAGER. Vì EAGER = luôn lấy role ngay khi load user
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL , fetch = FetchType.EAGER) //1 User -có->  nhiều bản ghi user_role
    Set<UserRole> userRoles = new HashSet<>();

    @OneToMany(mappedBy = "following", cascade = CascadeType.REMOVE, orphanRemoval = true)
    Set<Follow> followings = new HashSet<>();

    @OneToMany(mappedBy = "follower", cascade = CascadeType.REMOVE, orphanRemoval = true)
    Set<Follow> followers = new HashSet<>();

    @OneToMany(mappedBy = "liked_plan", cascade = CascadeType.REMOVE, orphanRemoval = true)
    Set<Plan> likedPlans = new HashSet<>();

    @OneToMany(mappedBy = "forked_plan", cascade = CascadeType.REMOVE, orphanRemoval = true)
    Set<Plan> forkedPlans = new HashSet<>();
}
