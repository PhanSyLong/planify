package com.planify.backend.repository;

import com.planify.backend.model.Follow;
import com.planify.backend.model.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<@NonNull Follow, @NonNull Integer> {

    // Get all followers (User objects) of a given user id using JPQL
    @Query("select f.follower from Follow f where f.following.id = :userId")
    List<User> findFollowersByUserId(@Param("userId") Integer userId);

    // Get all users that given user is following
    @Query("select f.following from Follow f where f.follower.id = :userId")
    List<User> findFollowingByUserId(@Param("userId") Integer userId);

    // existence check
    boolean existsByFollowerIdAndFollowingId(Integer followerId, Integer followingId);

    // delete/unfollow
    void deleteByFollowerIdAndFollowingId(Integer followerId, Integer followingId);
}
