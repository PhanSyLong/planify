package com.planify.backend.mapper;

import com.planify.backend.dto.response.UserResponse;
import com.planify.backend.model.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-06T20:40:57+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.1 (Ubuntu)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setId( user.getId() );
        userResponse.setUsername( user.getUsername() );

        return userResponse;
    }

    @Override
    public List<UserResponse> toUserResponseList(List<User> users) {
        if ( users == null ) {
            return null;
        }

        List<UserResponse> list = new ArrayList<UserResponse>( users.size() );
        for ( User user : users ) {
            list.add( toUserResponse( user ) );
        }

        return list;
    }
}
