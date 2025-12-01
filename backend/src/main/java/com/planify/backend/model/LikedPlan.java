package com.planify.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="tbl_liked_plan",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "plan_id"}))
public class LikedPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name="plan_id")
    private Plan plan;
}
