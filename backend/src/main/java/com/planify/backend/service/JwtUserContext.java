package com.planify.backend.service;

import com.planify.backend.model.Plan;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtUserContext {
    public Integer getCurrentUserId() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userIdLong = jwt.getClaim("userId");
        return userIdLong.intValue();
    }

    public boolean isCurrentUserAdmin() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return "SCOPE_ADMIN".equals(jwt.getClaim("scope"));
    }

    public boolean neitherPlanOwnerNorAdmin(Plan plan) {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userIdLong = jwt.getClaim("userId");

        boolean isOwner = plan.getOwner().getId().equals(userIdLong.intValue());
        boolean isAdmin = "SCOPE_ADMIN".equals(jwt.getClaim("scope"));

        return !isOwner && !isAdmin;
    }
}
