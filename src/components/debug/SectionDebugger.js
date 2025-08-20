import React from 'react';

/**
 * COMPOSANT DE DEBUG TEMPORAIRE
 * À utiliser pour vérifier que les sections arrivent bien avec la bonne structure
 * Supprimer une fois que tout fonctionne parfaitement
 */
const SectionDebugger = ({ section }) => {
  if (!section) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto',
      zIndex: 9999,
      border: '1px solid #333'
    }}>
      <h4 style={{margin: '0 0 5px 0', color: '#4ade80'}}>DEBUG: Section {section.type}</h4>
      
      <div style={{marginBottom: '5px'}}>
        <strong>ID:</strong> {section.id}
      </div>
      
      <div style={{marginBottom: '5px'}}>
        <strong>Type:</strong> {section.type}
      </div>
      
      <div style={{marginBottom: '5px'}}>
        <strong>Enabled:</strong> {section.enabled ? '✅' : '❌'}
      </div>
      
      <div style={{marginBottom: '5px'}}>
        <strong>Order:</strong> {section.order}
      </div>
      
      <div style={{marginBottom: '5px', paddingTop: '5px', borderTop: '1px solid #333'}}>
        <strong style={{color: '#f59e0b'}}>CONTENT:</strong>
      </div>
      
      {section.content ? (
        <>
          <div><strong>Title:</strong> {section.content.title || '(vide)'}</div>
          <div><strong>Subtitle:</strong> {section.content.subtitle || '(vide)'}</div>
          
          {section.content.images && (
            <div><strong>Images:</strong> {section.content.images.length} items</div>
          )}
          
          {section.content.categories && (
            <div><strong>Categories:</strong> {section.content.categories.length} items</div>
          )}
          
          {section.content.collections && (
            <div><strong>Collections:</strong> {section.content.collections.length} items</div>
          )}
        </>
      ) : (
        <div style={{color: '#ef4444'}}>❌ PAS DE CONTENT !</div>
      )}
    </div>
  );
};

export default SectionDebugger;
