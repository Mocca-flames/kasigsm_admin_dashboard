import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { getPresetPrices, applyPresetPrice, calculatePricePreview, overrideOrderPrice, getOrderPriceBreakdown } from '../services/api';
import '../styles/Pricing.css';
import Icon from '../components/Icons';

/* eslint-disable no-unused-vars */
// Catch bindings below are intentionally unused — errors are represented via state

/** services & pricing for the phone-repair shop */
const Services = () => {
  // preset / catalog state
  const [presets, setPresets] = useState({});
  const [presetsLoading, setPresetsLoading] = useState(true);
  const [presetsError, setPresetsError] = useState(null);

  // modal
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '', data: null });

  // price calculator
  const [calcForm, setCalcForm] = useState({ distance_km: '', rate_per_km: '', minimum_fare: '' });
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState(null);

  // order price override
  const [overrideForm, setOverrideForm] = useState({ orderId: '', newPrice: '', reason: '' });
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [overrideResult, setOverrideResult] = useState(null);
  const [overrideError, setOverrideError] = useState(null);

  // price breakdown
  const [breakdownOrderId, setBreakdownOrderId] = useState('');
  const [breakdownResult, setBreakdownResult] = useState(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownError, setBreakdownError] = useState(null);

  useEffect(() => { loadPresets(); }, []);

  /* ── Presets / Service Catalog ── */
  const loadPresets = async () => {
    try {
      setPresetsLoading(true);
      setPresetsError(null);
      const response = await getPresetPrices();
      setPresets(response.presets || {});
    } catch (Js) {
      setPresetsError('Failed to load service catalog');
    } finally {
      setPresetsLoading(false);
    }
  };

    const handleApplyPreset = async (presetName) => {
        try {
            const result = await applyPresetPrice(presetName);
            await loadPresets();
            setModal({
                isOpen: true, type: 'success',
                title: 'Pricing Applied',
                message: result.message || `Applied ${presetName.replace('_', ' ')} pricing`,
                data: result,
            });
        } catch (e) {
            setModal({
                isOpen: true, type: 'error',
                title: 'Failed',
                message: e.message || `Failed to apply ${presetName}`,
                data: null,
            });
        }
    };

  /* ── Price Calculator ── */
  const handleCalculatePrice = async () => {
    if (!calcForm.distance_km) { setCalcError('Estimate hours / units is required'); return; }
    try {
      setCalcLoading(true);
      setCalcError(null);
      const result = await calculatePricePreview(
        parseFloat(calcForm.distance_km),
        calcForm.rate_per_km ? parseFloat(calcForm.rate_per_km) : null,
        calcForm.minimum_fare ? parseFloat(calcForm.minimum_fare) : null,
      );
      setCalcResult(result);
    } catch (Js) {
      setCalcError('Failed to calculate estimated price');
    } finally {
      setCalcLoading(false);
    }
  };

  /* ── Price Override ── */
  const handleOverridePrice = async () => {
    if (!overrideForm.orderId || !overrideForm.newPrice) { setOverrideError('Order ID and new price are required'); return; }
    try {
      setOverrideLoading(true);
      setOverrideError(null);
      const result = await overrideOrderPrice(
        overrideForm.orderId,
        parseFloat(overrideForm.newPrice),
        overrideForm.reason || null,
      );
      setOverrideResult(result);
      setOverrideForm({ orderId: '', newPrice: '', reason: '' });
    } catch (Js) {
      setOverrideError('Failed to override repair cost');
    } finally {
      setOverrideLoading(false);
    }
  };

  /* ── Price Breakdown ── */
  const handleGetBreakdown = async () => {
    if (!breakdownOrderId) { setBreakdownError('Order ID is required'); return; }
    try {
      setBreakdownLoading(true);
      setBreakdownError(null);
      const result = await getOrderPriceBreakdown(breakdownOrderId);
      setBreakdownResult(result);
    } catch (Js) {
      setBreakdownError('Failed to fetch repair cost breakdown');
    } finally {
      setBreakdownLoading(false);
    }
  };

  const handleCalcFormChange = (field, value) => {
    setCalcForm(prev => ({ ...prev, [field]: value }));
    if (calcError) setCalcError(null);
  };

  const handleOverrideFormChange = (field, value) => {
    setOverrideForm(prev => ({ ...prev, [field]: value }));
    if (overrideError) setOverrideError(null);
  };

  /* ── Service icons for known presets ── */
  const getServiceIcon = (name) => {
    const map = {
      screen_replacement: <Icon name="smartphone" size={16} />,
      battery_replacement: <Icon name="battery" size={16} />,
      charging_port: <Icon name="plug" size={16} />,
      water_damage: <Icon name="droplet" size={16} />,
      camera_repair: <Icon name="camera" size={16} />,
      software_repair: <Icon name="laptop" size={16} />,
    };
    return map[name] || <Icon name="wrench" size={16} />;
  };

  return (
    <div className="pricing-container">
      <h1>Services &amp; Pricing</h1>

      {/* ── Service Catalog ── */}
      <div className="pricing-section">
        <h2>Service Catalog</h2>
        <Card title="Available Repair Services">
          {presetsLoading ? (
            <div className="loading-state">Loading service catalog...</div>
          ) : presetsError ? (
            <div className="error-message">{presetsError}</div>
          ) : (
            <div className="preset-grid">
              {Object.entries(presets).map(([name, preset]) => (
                <div key={name} className="preset-card">
                  <div className="preset-name">{getServiceIcon(name)} {name.replace(/_/g, ' ').toUpperCase()}</div>
                  <div className="preset-description">{preset.description || 'Standard repair service'}</div>
                  <div className="preset-rates">
                    <div>
                      <div className="rate-label">Rate / hr (est.)</div>
                      <div className="rate-value">R{preset.rate_per_km ?? preset.rate_per_hour ?? '—'}</div>
                    </div>
                    <div>
                      <div className="rate-label">Base Price</div>
                      <div className="rate-value">R{preset.minimum_fare}</div>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleApplyPreset(name)}>
                    Apply Pricing
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Cost Calculator ── */}
      <div className="pricing-section">
        <h2>Repair Cost Calculator</h2>
        <Card title="Estimate Repair Cost">
          <div className="form-grid">
            <Input
              label="Est. Repair Time (hrs)"
              type="number"
              step="0.5"
              value={calcForm.distance_km}
              onChange={(e) => handleCalcFormChange('distance_km', e.target.value)}
              placeholder="e.g. 1.5"
              required
            />
            <Input
              label="Rate per Hour (R) – optional"
              type="number"
              step="10"
              value={calcForm.rate_per_km}
              onChange={(e) => handleCalcFormChange('rate_per_km', e.target.value)}
              placeholder="Use default rate"
            />
            <Input
              label="Parts Cost (R) – optional"
              type="number"
              step="0.01"
              value={calcForm.minimum_fare}
              onChange={(e) => handleCalcFormChange('minimum_fare', e.target.value)}
              placeholder="Estimated parts"
            />
          </div>
          <div className="form-actions">
            <Button variant="primary" onClick={handleCalculatePrice} loading={calcLoading}>
              Calculate Estimate
            </Button>
          </div>

          {calcError && <div className="error-message">{calcError}</div>}

          {calcResult && (
            <div className="price-result success">
              <h4>Estimated Repair Cost</h4>
              <div className="price-details">
                <div className="price-detail">
                  <span className="price-detail-label">Labour (hrs):</span>
                  <span className="price-detail-value">{calcResult.distance_km} hr{parseFloat(calcResult.distance_km) !== 1 ? 's' : ''}</span>
                </div>
                <div className="price-detail">
                  <span className="price-detail-label">Hourly Rate:</span>
                  <span className="price-detail-value">R{calcResult.rate_per_km}</span>
                </div>
                <div className="price-detail">
                  <span className="price-detail-label">Parts &amp; Materials:</span>
                  <span className="price-detail-value">R{calcResult.minimum_fare}</span>
                </div>
                <div className="price-detail">
                  <span className="price-detail-label">Labour Subtotal:</span>
                  <span className="price-detail-value">R{(parseFloat(calcResult.distance_km) * parseFloat(calcResult.rate_per_km)).toFixed(2)}</span>
                </div>
                <div className="price-detail" style={{ borderTop: '2px solid var(--primary-color)', paddingTop: '8px', marginTop: '4px' }}>
                  <span className="price-detail-label"><strong>Final Estimate</strong></span>
                  <span className="price-detail-value"><strong>R{calcResult.final_price}</strong></span>
                </div>
                {calcResult.minimum_fare_applied && (
                  <div className="price-detail">
                    <span className="price-detail-label">Minimum Charge Applied:</span>
                    <span className="price-detail-value">Yes</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Repair Cost Tools ── */}
      <div className="pricing-section">
        <h2>Repair Cost Tools</h2>
        <div className="pricing-grid">
          {/* Override Cost */}
          <Card title="Override Repair Cost">
            <div className="form-grid">
              <Input
                label="Ticket / Order ID"
                value={overrideForm.orderId}
                onChange={(e) => handleOverrideFormChange('orderId', e.target.value)}
                placeholder="e.g. 42"
                required
              />
              <Input
                label="New Repair Cost (R)"
                type="number"
                step="0.01"
                value={overrideForm.newPrice}
                onChange={(e) => handleOverrideFormChange('newPrice', e.target.value)}
                placeholder="Enter adjusted cost"
                required
              />
            </div>
            <Input
              label="Reason (optional)"
              value={overrideForm.reason}
              onChange={(e) => handleOverrideFormChange('reason', e.target.value)}
              placeholder="e.g. Discount, extra parts needed"
            />
            <div className="form-actions">
              <Button variant="danger" onClick={handleOverridePrice} loading={overrideLoading}>
                Override Cost
              </Button>
            </div>

            {overrideError && <div className="error-message">{overrideError}</div>}
            {overrideResult && (
              <div className="price-result success">
                <h4>Cost Updated</h4>
                <p>Ticket #{overrideResult.id} set to R{overrideResult.price}</p>
              </div>
            )}

            <Modal
              isOpen={modal.isOpen}
              onClose={() => setModal({ ...modal, isOpen: false })}
              title={modal.title}
              size="md"
            >
              <div style={{ textAlign: 'center' }}>
                {modal.type === 'success' && <div style={{ color: 'var(--success)', fontSize: '3rem', marginBottom: '1rem' }}><Icon name="check" size={36} /></div>}
                {modal.type === 'error' && <div style={{ color: 'var(--danger)', fontSize: '3rem', marginBottom: '1rem' }}><Icon name="x" size={36} /></div>}
                <p style={{ marginBottom: '1rem' }}>{modal.message}</p>
                {modal.data && modal.type === 'success' && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Details:</h4>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {Object.entries(modal.data).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key.replace('_', ' ')}:</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{typeof value === 'number' ? `R${value}` : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          </Card>

          {/* Cost Breakdown */}
          <Card title="Repair Cost Breakdown">
            <Input
              label="Ticket / Order ID"
              value={breakdownOrderId}
              onChange={(e) => { setBreakdownOrderId(e.target.value); if (breakdownError) setBreakdownError(null); }}
              placeholder="e.g. 42"
              required
            />
            <div className="form-actions">
              <Button variant="secondary" onClick={handleGetBreakdown} loading={breakdownLoading}>
                Get Breakdown
              </Button>
            </div>

            {breakdownError && <div className="error-message">{breakdownError}</div>}

            {breakdownResult && (
              <div className="breakdown-section">
                <h4>Cost Breakdown — Ticket {breakdownResult.order_id}</h4>
                <div className="breakdown-grid">
                  <div className="breakdown-item"><div className="breakdown-label">Actual Cost</div><div className="breakdown-value">R{breakdownResult.actual_price}</div></div>
                  <div className="breakdown-item"><div className="breakdown-label">Distance (km)</div><div className="breakdown-value">{breakdownResult.distance_km} km</div></div>
                  <div className="breakdown-item"><div className="breakdown-label">Rate / km</div><div className="breakdown-value">R{breakdownResult.rate_per_km}</div></div>
                  <div className="breakdown-item"><div className="breakdown-label">Minimum Fare</div><div className="breakdown-value">R{breakdownResult.minimum_fare}</div></div>
                  <div className="breakdown-item"><div className="breakdown-label">Calculated Cost</div><div className="breakdown-value">R{breakdownResult.calculated_price}</div></div>
                  <div className="breakdown-item"><div className="breakdown-label">Expected Cost</div><div className="breakdown-value">R{breakdownResult.should_be_price}</div></div>
                  <div className="breakdown-item"><div className="breakdown-label">Difference</div><div className="breakdown-value">R{breakdownResult.difference}</div></div>
                  <div className="breakdown-item"><div className="breakdown-label">Custom Price</div><div className="breakdown-value">{breakdownResult.is_custom_price ? 'Yes' : 'No'}</div></div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
