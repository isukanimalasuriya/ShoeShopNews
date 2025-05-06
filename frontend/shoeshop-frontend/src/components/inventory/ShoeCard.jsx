
import { Link } from 'react-router-dom';

const ShoeCard = ({ shoe, onDelete }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        width: '200px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <img
        src={shoe.variants[0]?.imageUrl || '/default-shoe.jpg'}
        alt={`${shoe.brand} ${shoe.model}`}
        style={{ width: '100%', height: 'auto', borderRadius: '3px' }}
      />
      <h3 style={{ margin: '10px 0', fontSize: '16px' }}>
        {shoe.brand} {shoe.model}
      </h3>
      <p style={{ margin: '5px 0' }}>Price: ${shoe.price}</p>
      <p style={{ margin: '5px 0' }}>
        Colors: {shoe.variants.map((v) => v.color).join(', ') || 'N/A'}
      </p>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginTop: '10px',
        }}
      >
        <Link
          to={`/shoes/${shoe._id}`}
          style={{ padding: '5px 10px', color: '#007bff', textDecoration: 'none' }}
        >
          View
        </Link>
        <Link
          to={`/shoes/${shoe._id}/edit`}
          style={{ padding: '5px 10px', color: '#007bff', textDecoration: 'none' }}
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(shoe._id)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ShoeCard;