import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AvatarCard from '../profiles/MyAvatar';
import BioAndMenu from '../profiles/MyBioMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './UserView.css';

const MOCK_USER_DATA = {
    'user-1': {
        name: 'Emma Johnson',
        bio: 'IELTS 8.5 | Official Examiner & Mentor. Helping students achieve Band 7+!',
        avatar: null,
        stats: { plans: 18, followings: 320, followers: 2450 },
        isFollowing: false,
    },
    'user-2': {
        name: 'Alex Chen',
        bio: 'TOEFL 115+ | 12 years teaching experience',
        avatar: null,
        stats: { plans: 14, followings: 280, followers: 1890 },
        isFollowing: true,
    },
    'user-3': {
        name: 'Sarah Williams',
        bio: 'Helping students reach Band 7+ since 2015',
        avatar: null,
        stats: { plans: 22, followings: 450, followers: 3200 },
        isFollowing: false,
    },
};

const UserView = () => {
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            setLoading(true);

            try {
                // TODO: Replace with actual API call
                // const response = await fetch(`/api/users/${id}`);
                // const data = await response.json();

                await new Promise(resolve => setTimeout(resolve, 800));

                if (isMounted) {
                    const mockUser = MOCK_USER_DATA[id] || MOCK_USER_DATA['user-1'];
                    setUserData(mockUser);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleFollowToggle = useCallback(() => {
        setUserData(prev => ({
            ...prev,
            isFollowing: !prev.isFollowing,
            stats: {
                ...prev.stats,
                followers: prev.isFollowing
                    ? prev.stats.followers - 1
                    : prev.stats.followers + 1
            }
        }));
        // TODO: Call API to update follow status
    }, []);

    const handleMessage = useCallback(() => {
        console.log('Message user:', id);
        // TODO: Implement messaging
    }, [id]);

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (!userData) {
        return <div className="loading">User not found</div>;
    }

    return (
        <div className="userview-page">
            {/* Profile Header */}
            <div className="profile-header-section">
                <AvatarCard avatarUrl={userData.avatar} name={userData.name} />

                <div className="profile-info-section">
                    {/* Name + Action Buttons */}
                    <div className="profile-name-row">
                        <h2>{userData.name}</h2>

                        <div className="action-buttons">
                            <button
                                className={`follow-btn ${userData.isFollowing ? 'following' : ''}`}
                                onClick={handleFollowToggle}
                            >
                                {userData.isFollowing ? 'Following' : 'Follow'}
                            </button>

                            <button className="message-btn" onClick={handleMessage}>
                                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">{userData.stats.plans}</span>
                            <span className="stat-label">Plans</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{userData.stats.followings}</span>
                            <span className="stat-label">Following</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{userData.stats.followers}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio and Menu (view only) */}
            <BioAndMenu bio={userData.bio} isViewOnly={true} />
        </div>
    );
};

export default UserView;