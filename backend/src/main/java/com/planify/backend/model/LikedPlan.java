package com.planify.backend.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name="liked_plan",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "plan_id"}))
public class LikedPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name="user_id", nullable = false)
    User user;

    @ManyToOne(optional = false)
    @JoinColumn(name="plan_id", nullable = false)
    Plan plan;
}
