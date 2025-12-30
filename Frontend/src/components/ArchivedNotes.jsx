import { useEffect, useState } from 'react'
import React from 'react'

const ArchivedNotes = () => {

    const [archivedNotes, setArchivedNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch archived notes
    useEffect(() => {
        const fetchArchived = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch ("http://localhost:5000/api/notes/archived")
            }
        }
    })

  return (
    <div>
      
    </div>
  )
}

export default ArchivedNotes
