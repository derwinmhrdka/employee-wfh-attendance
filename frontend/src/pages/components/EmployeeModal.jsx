import React from 'react'

export default function EmployeeModal({
  show,
  onClose,
  onSave,
  data,
  setData,
  photo,
  setPhoto,
  profilePhoto,
  context,
  isEdit
}) {
  if (!show) return null

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <>
      <div
        className="modal-backdrop show"
        style={{
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1040
        }}
      ></div>

      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={onSave}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? 'Edit' : 'Add'} {context === 'admin' ? 'Employee' : 'Profile'}
                </h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>

              <div className="modal-body">
                <div className="mb-3 d-flex justify-content-center">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      key={photo ? photo.name : profilePhoto}
                      src={
                        photo
                          ? URL.createObjectURL(photo)
                          : profilePhoto
                            ? `${import.meta.env.VITE_BASE_URL}/uploads/profile/${profilePhoto}`
                            : `${import.meta.env.VITE_BASE_URL}/uploads/profile/default.png`
                      }
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `${import.meta.env.VITE_BASE_URL}/uploads/profile/default.png`
                      }}
                      alt="Preview"
                      className="rounded-circle border border-3"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('photoInput').click()}
                    />
                    <span
                      onClick={() => document.getElementById('photoInput').click()}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        color: '#007bff',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: 3,
                      }}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </span>
                  </div>
                  <input
                    id="photoInput"
                    type="file"
                    name="photo"
                    className="form-control d-none"
                    onChange={(e) => {
                        setPhoto(e.target.files[0]);
                        e.target.value = null;
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label>Name</label>
                  <input
                    name="name"
                    className="form-control"
                    value={data.name || ''}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    value={data.email || ''}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>

                <div className="mb-3">
                  <label>Position</label>
                  <select
                    name="position"
                    className="form-select"
                    value={data.position || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select Position --</option>
                    <option value="HRD">HRD</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Phone</label>
                  <input
                    name="phone"
                    className="form-control"
                    value={data.phone || ''}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      setData({
                        ...data,
                        phone: onlyNums
                      });
                    }}
                    maxLength={20}
                    placeholder="Enter phone number"
                  />
                </div>

                {context === 'admin' && (
                  <>
                    <div className="mb-3">
                      <label>Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={data.status || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Status --</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        name="isAdmin"
                        className="form-check-input"
                        checked={!!data.isAdmin}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">Is Admin</label>
                    </div>
                  </>
                )}

                {context === 'employee' && (
                  <>
                    <div className="mb-3">
                      <label>Old Password</label>
                      <input
                        name="oldPassword"
                        type="password"
                        className="form-control"
                        value={data.oldPassword || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label>New Password</label>
                      <input
                        name="newPassword"
                        type="password"
                        className="form-control"
                        value={data.newPassword || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary w-100">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
  