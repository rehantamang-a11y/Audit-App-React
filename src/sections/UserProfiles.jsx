import React from 'react';
import UserProfile from '../components/UserProfile/UserProfile';
import SectionComments from '../components/Section/SectionComments';

export default function UserProfiles({ getField, updateField }) {
  const rawIds = getField('5-userIds');
  let userIds;
  try {
    userIds = rawIds ? JSON.parse(rawIds) : [1];
  } catch {
    userIds = [1];
  }

  const rawNext = getField('5-nextId');
  const parsedNext = parseInt(rawNext, 10);
  const nextId = Number.isNaN(parsedNext) ? 2 : parsedNext;

  const addUser = () => {
    const newUserIds = [...userIds, nextId];
    updateField('5-userIds', JSON.stringify(newUserIds));
    updateField('5-nextId', String(nextId + 1));
  };

  const removeUser = (uid) => {
    updateField('5-userIds', JSON.stringify(userIds.filter(id => id !== uid)));
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
