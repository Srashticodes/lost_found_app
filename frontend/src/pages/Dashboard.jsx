import { useState, useEffect } from 'react';
import API from '../api/axios';
import { LogOut, Search, Plus, Trash2, Edit3, MapPin, Calendar, Phone } from 'lucide-react';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '', description: '', type: 'Lost', location: '', contactInfo: ''
    });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const { data } = await API.get('/items');
        setItems(data);
    };

    const handleSearch = async (e) => {
        setSearch(e.target.value);
        if (e.target.value.trim() === '') {
            fetchItems();
        } else {
            const { data } = await API.get(`/items/search?name=${e.target.value}`);
            setItems(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await API.put(`/items/${isEditing}`, formData);
                setIsEditing(null);
            } else {
                await API.post('/items', formData);
            }
            setFormData({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
            fetchItems();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await API.delete(`/items/${id}`);
            fetchItems();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/login';
    };

    const handleEdit = (item) => {
        setIsEditing(item._id);
        setFormData({
            itemName: item.itemName,
            description: item.description,
            type: item.type,
            location: item.location,
            contactInfo: item.contactInfo
        });
    };

    return (
        <div>
            <header className="header">
                <div>
                    <h1>Lost & Found</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}</p>
                </div>
                <button className="logout-btn btn-secondary" onClick={handleLogout}>
                    <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
                </button>
            </header>

            <div className="search-bar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        style={{ paddingLeft: '40px' }}
                        type="text" 
                        placeholder="Search items by name..." 
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <h2>{isEditing ? 'Update Item' : 'Report New Item'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Item Name</label>
                            <input type="text" value={formData.itemName} required
                                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea rows="3" value={formData.description} required
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select value={formData.type} 
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="Lost">Lost</option>
                                <option value="Found">Found</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" value={formData.location} required
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Contact Info</label>
                            <input type="text" value={formData.contactInfo} required
                                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} />
                        </div>
                        <button type="submit">{isEditing ? 'Save Changes' : 'Submit Report'}</button>
                        {isEditing && (
                            <button type="button" className="btn-secondary" style={{ marginTop: '10px' }}
                                onClick={() => { setIsEditing(null); setFormData({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' }); }}>
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <div className="item-list">
                    {items.map(item => (
                        <div key={item._id} className="item-card">
                            <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
                            <h3>{item.itemName}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 1rem' }}>{item.description}</p>
                            
                            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={14} /> {item.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} /> {new Date(item.date).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Phone size={14} /> {item.contactInfo}
                                </div>
                            </div>

                            <p style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.7 }}>Reported by: {item.user.name}</p>

                            {user._id === item.user._id && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                    <button className="btn-secondary" style={{ padding: '6px', width: 'auto', flex: 1 }} onClick={() => handleEdit(item)}>
                                        <Edit3 size={16} />
                                    </button>
                                    <button className="btn-danger" style={{ padding: '6px', width: 'auto', flex: 1 }} onClick={() => handleDelete(item._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {items.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '2rem' }}>No items found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
