/**
 * AdminDashboard - Panel de administración principal
 * Permite gestionar usuarios con las funciones de PostgreSQL
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@store/appStore';
import { adminAPI, AdminUser } from '../api/adminApi';
import { Search, Ban, Trash2, Heart, LogOut, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Estilos CSS en línea para el dashboard
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1.5rem 2rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#fff',
    fontSize: '1.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    color: '#ef4444',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    color: '#fff',
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(30, 30, 50, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    color: '#fff',
  },
  dangerBtn: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
  },
  warningBtn: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#fff',
  },
  resultBox: {
    marginTop: '1rem',
    padding: '1rem',
    borderRadius: '10px',
    fontSize: '0.875rem',
  },
  successBox: {
    background: 'rgba(34, 197, 94, 0.2)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    color: '#22c55e',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
  },
  userInfo: {
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    padding: '1rem',
    borderRadius: '10px',
    marginTop: '1rem',
  },
  userInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.25rem 0',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.875rem',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  },
} as const;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAppStore();
  
  // Estados para buscar usuario
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<AdminUser | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Estados para banear usuario
  const [banUserId, setBanUserId] = useState('');
  const [banConfirm, setBanConfirm] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const [banResult, setBanResult] = useState<{ success: boolean; message: string } | null>(null);

  // Estados para eliminar usuario
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{ success: boolean; message: string } | null>(null);

  // Estados para actualizar género
  const [genderEmail, setGenderEmail] = useState('');
  const [genderPref, setGenderPref] = useState('');
  const [genderLoading, setGenderLoading] = useState(false);
  const [genderResult, setGenderResult] = useState<{ success: boolean; message: string } | null>(null);

  // Handlers
  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    
    setSearchLoading(true);
    setSearchError('');
    setFoundUser(null);
    
    try {
      const result = await adminAPI.getUserByEmail(searchEmail);
      setFoundUser(result);
    } catch (error: any) {
      setSearchError(error.response?.data?.error || 'Error al buscar usuario');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBan = async () => {
    if (!banUserId || !banConfirm) return;
    
    setBanLoading(true);
    setBanResult(null);
    
    try {
      const result = await adminAPI.banUser(parseInt(banUserId), banConfirm);
      setBanResult({ success: true, message: result.message });
      setBanUserId('');
      setBanConfirm(false);
    } catch (error: any) {
      setBanResult({ success: false, message: error.response?.data?.error || 'Error al banear usuario' });
    } finally {
      setBanLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId || !deleteConfirm) return;
    
    setDeleteLoading(true);
    setDeleteResult(null);
    
    try {
      const result = await adminAPI.deleteUser(parseInt(deleteUserId), deleteConfirm);
      setDeleteResult({ success: true, message: result.message });
      setDeleteUserId('');
      setDeleteConfirm(false);
    } catch (error: any) {
      setDeleteResult({ success: false, message: error.response?.data?.error || 'Error al eliminar usuario' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGenderUpdate = async () => {
    if (!genderEmail.trim() || !genderPref) return;
    
    setGenderLoading(true);
    setGenderResult(null);
    
    try {
      const result = await adminAPI.updateGenderPreference(genderEmail, genderPref);
      setGenderResult({ success: true, message: result.message });
      setGenderEmail('');
      setGenderPref('');
    } catch (error: any) {
      setGenderResult({ success: false, message: error.response?.data?.error || 'Error al actualizar género' });
    } finally {
      setGenderLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          <Shield size={28} color="#ec4899" />
          Panel de Administración
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            {user?.email}
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      {/* Grid de tarjetas */}
      <div style={styles.grid}>
        {/* Buscar Usuario */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Search size={20} color="#6366f1" />
            Buscar Usuario por Email
          </h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email del usuario</label>
            <input
              type="email"
              style={styles.input}
              placeholder="ejemplo@email.com"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            style={{ ...styles.button, ...styles.primaryBtn }}
            onClick={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? 'Buscando...' : (
              <>
                <Search size={18} />
                Buscar
              </>
            )}
          </button>
          
          {searchError && (
            <div style={{ ...styles.resultBox, ...styles.errorBox }}>
              <XCircle size={16} style={{ marginRight: '0.5rem' }} />
              {searchError}
            </div>
          )}
          
          {foundUser && (
            <div style={styles.userInfo}>
              <div style={styles.userInfoRow}>
                <span>ID:</span>
                <strong style={{ color: '#fff' }}>{foundUser.usuario_id}</strong>
              </div>
              <div style={styles.userInfoRow}>
                <span>Nombre:</span>
                <strong style={{ color: '#fff' }}>{foundUser.nombres} {foundUser.apellidos}</strong>
              </div>
              <div style={styles.userInfoRow}>
                <span>Email:</span>
                <strong style={{ color: '#fff' }}>{foundUser.email}</strong>
              </div>
              <div style={styles.userInfoRow}>
                <span>Estado:</span>
                <strong style={{ color: '#fff' }}>{foundUser.estadocuenta}</strong>
              </div>
              <div style={styles.userInfoRow}>
                <span>Superusuario:</span>
                <strong style={{ color: foundUser.is_superuser ? '#22c55e' : '#ef4444' }}>
                  {foundUser.is_superuser ? 'Sí' : 'No'}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Banear Usuario */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Ban size={20} color="#f59e0b" />
            Banear Usuario
          </h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID del usuario</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Ej: 123"
              value={banUserId}
              onChange={(e) => setBanUserId(e.target.value)}
            />
          </div>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={banConfirm}
              onChange={(e) => setBanConfirm(e.target.checked)}
            />
            <AlertTriangle size={16} color="#f59e0b" />
            Confirmo que deseo banear este usuario
          </label>
          <button
            style={{ ...styles.button, ...styles.warningBtn, opacity: (!banUserId || !banConfirm) ? 0.5 : 1 }}
            onClick={handleBan}
            disabled={banLoading || !banUserId || !banConfirm}
          >
            {banLoading ? 'Baneando...' : (
              <>
                <Ban size={18} />
                Banear Usuario
              </>
            )}
          </button>
          
          {banResult && (
            <div style={{ ...styles.resultBox, ...(banResult.success ? styles.successBox : styles.errorBox) }}>
              {banResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span style={{ marginLeft: '0.5rem' }}>{banResult.message}</span>
            </div>
          )}
        </div>

        {/* Eliminar Usuario */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Trash2 size={20} color="#ef4444" />
            Eliminar Usuario
          </h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID del usuario</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Ej: 123"
              value={deleteUserId}
              onChange={(e) => setDeleteUserId(e.target.value)}
            />
          </div>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.checked)}
            />
            <AlertTriangle size={16} color="#ef4444" />
            Confirmo que deseo ELIMINAR permanentemente este usuario
          </label>
          <button
            style={{ ...styles.button, ...styles.dangerBtn, opacity: (!deleteUserId || !deleteConfirm) ? 0.5 : 1 }}
            onClick={handleDelete}
            disabled={deleteLoading || !deleteUserId || !deleteConfirm}
          >
            {deleteLoading ? 'Eliminando...' : (
              <>
                <Trash2 size={18} />
                Eliminar Usuario
              </>
            )}
          </button>
          
          {deleteResult && (
            <div style={{ ...styles.resultBox, ...(deleteResult.success ? styles.successBox : styles.errorBox) }}>
              {deleteResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span style={{ marginLeft: '0.5rem' }}>{deleteResult.message}</span>
            </div>
          )}
        </div>

        {/* Actualizar Género Preferido */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Heart size={20} color="#ec4899" />
            Actualizar Género Preferido
          </h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email del usuario</label>
            <input
              type="email"
              style={styles.input}
              placeholder="ejemplo@email.com"
              value={genderEmail}
              onChange={(e) => setGenderEmail(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Género preferido</label>
            <select
              style={styles.select}
              value={genderPref}
              onChange={(e) => setGenderPref(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <button
            style={{ ...styles.button, ...styles.primaryBtn, opacity: (!genderEmail || !genderPref) ? 0.5 : 1 }}
            onClick={handleGenderUpdate}
            disabled={genderLoading || !genderEmail || !genderPref}
          >
            {genderLoading ? 'Actualizando...' : (
              <>
                <Heart size={18} />
                Actualizar Género
              </>
            )}
          </button>
          
          {genderResult && (
            <div style={{ ...styles.resultBox, ...(genderResult.success ? styles.successBox : styles.errorBox) }}>
              {genderResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span style={{ marginLeft: '0.5rem' }}>{genderResult.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
