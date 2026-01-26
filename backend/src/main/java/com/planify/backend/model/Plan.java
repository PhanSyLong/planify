package com.planify.backend.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name="plan")
public class Plan {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = false, unique = true,  length = 120)
    String title;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    User owner;

    @Column(nullable = false, length = 120)
    String description;

    @Column(nullable = false, columnDefinition = "ENUM('private', 'public')")
    String visibility;

    @Column(nullable = false, columnDefinition = "ENUM('incompleted', 'completed', 'cancelled')")
    String status;

    @Column(nullable = false)
    long duration;

    String picture;

    @CreationTimestamp
    @Column(name="created_date", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_date", nullable = false)
    LocalDateTime updatedAt;

    @Column(name="started_at")
    LocalDateTime started_at;

    @Column(name="completed_at")
    LocalDateTime completed_at;

    @Column
    LocalDateTime reminderAt;

    @Column
    LocalDateTime expiredAt;

    @Column
    boolean reminderSent;

    @Column
    boolean expiredSent;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL)
    Set<TagPlan> tagPlans = new HashSet<>();

    @OneToMany(mappedBy = "plan", cascade = CascadeType.REMOVE, orphanRemoval = true)
    Set<Bookmark> plans = new HashSet<>();

    @OneToMany(mappedBy = "originalPlan", cascade = CascadeType.REMOVE, orphanRemoval = true)
    Set<ForkedPlan> originalPlans = new HashSet<>();

    @OneToMany(mappedBy = "adoptedPlan", cascade = CascadeType.REMOVE, orphanRemoval = true)
    Set<ForkedPlan> adoptedPlans = new HashSet<>();
}
