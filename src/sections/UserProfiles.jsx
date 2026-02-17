import React, { useState } from 'react';
import UserProfile from '../components/UserProfile/UserProfile';
import SectionComments from '../components/Section/SectionComments';

export default function UserProfiles({ getField, updateField }) {
  const [userIds, setUserIds] = useState([1]);
  const [nextId, setNextId] = useState(2);

  const addUser = () => {
    setUserIds(prev => [...prev, nextId]);
    setNextId(prev => prev + 1);
  };

  const removeUser = (uid) => {
    setUserIds(prev => prev.filter(id => id !== uid));
  };

  return (
    <>
      {userIds.map(uid => (
        <UserProfile
          key={uid}
          uid={uid}
          canRemove={userIds.length > 1}
          onRemove={removeUser}
          getField={getField}
          updateField={updateField}
        />
      ))}
      <button className="add-user-btn" onClick={addUser}>
        + Add Another User
      </button>
      <SectionComments
        fieldKey="5-comments"
        value={getField('5-comments')}
        onChange={updateField}
        placeholder="Overall notes on user needs, mobility concerns, special requirements..."
      />
    </>
  );
}
