package com.planify.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="tbl_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 255, nullable = false)
    private String username;
    @Column(length = 255, nullable = false)
    private String password;
    @Column(length = 255, nullable = false)
    private String email;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setName(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    public boolean isNotification_enabled() {
        return notification_enabled;
    }
    public void setNotification_enabled(boolean notification_enabled) {
        this.notification_enabled = notification_enabled;
    }
    public Long getCreated_by() {
        return created_by;
    }
    public void setCreated_by(Long created_by) {
        this.created_by = created_by;
    }
    public Long getUpdated_by() {
        return updated_by;
    }
    public void setUpdated_by(Long updated_by) {
        this.updated_by = updated_by;
    }
    public LocalDateTime getCreated_date() {
        return created_date;
    }
    public void setCreated_date(LocalDateTime created_date) {
        this.created_date = created_date;
    }
    public LocalDateTime getUpdated_date() {
        return updated_date;
    }
    public void setUpdated_date(LocalDateTime updated_date) {
        this.updated_date = updated_date;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    private String avatar;
    @Column(columnDefinition = "BIT(1)", nullable = false)
    private boolean notification_enabled;
    private Long created_by;
    private Long updated_by;
    private LocalDateTime created_date;
    private LocalDateTime updated_date;
    private int status;

    @OneToMany(mappedBy = "following", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Follow> followings = new HashSet<>();

    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Follow> followers = new HashSet<>();

    public User() {
    }
    public User(String username, String password, String email, String avatar, boolean notification_enabled) {}
}
