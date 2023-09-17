import React, { Fragment, useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ContactItem from './ContactItem';
import Spinner from '../layout/Spinner';
import ContactContext from '../../context/contact/contactContext';
import { saveAs } from 'file-saver';

const Contacts = () => {
  const contactContext = useContext(ContactContext);

  const { contacts, filtered, getContacts, loading } = contactContext;

  // State for sorting criteria
  const [sortCriteria, setSortCriteria] = useState('name');

  // Function to sort contacts
  const sortContacts = (criteria) => {
    return [...contacts].sort((a, b) => {
      if (criteria === 'name') {
        return a.name.localeCompare(b.name);
      } else if (criteria === 'email') {
        return a.email.localeCompare(b.email);
      } else if (criteria === 'recentlyAdded') {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
      // Add more sorting criteria here as needed
      return 0;
    });
  };

  // Function to handle sorting criteria change
  const handleSortChange = (e) => {
    const criteria = e.target.value;
    setSortCriteria(criteria);
  };

  useEffect(() => {
    getContacts();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!contacts || contacts.length === 0) {
    return <h4>Please add a contact</h4>;
  }

  const handleDownload = () => {
    const dataToDownload = filtered || sortContacts(sortCriteria); // Use sortContacts for download
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'contacts.json');
  };

  return (
    <Fragment>
 
      <div>
        <label>Sort by:</label>
        <select onChange={handleSortChange} value={sortCriteria}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="recentlyAdded">Recently Added</option> {/* Add sorting by recently added */}
          {/* Add more sorting criteria options here */}
        </select>
      </div>
      <TransitionGroup>
        {(filtered !== null ? filtered : sortContacts(sortCriteria)).map(
          (contact) => (
            <CSSTransition key={contact._id} timeout={500} classNames='item'>
              <ContactItem contact={contact} />
            </CSSTransition>
          )
        )}
      </TransitionGroup>
      <button
        style={{
          backgroundColor: '#bcb6b4',
          borderRadius: '6px',
          padding: '6px',
          cursor: 'pointer',
        }}
        onClick={handleDownload}
      >
        Download Contacts
      </button>
    </Fragment>
  );
};

export default Contacts;

