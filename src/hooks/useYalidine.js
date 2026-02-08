import { useState, useEffect } from 'react';
import yalidineService from '../services/yalidineService';
import { toast } from 'react-hot-toast';

export const useYalidine = (formData, setFormData) => {
    const [wilayas, setWilayas] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [loadingWilayas, setLoadingWilayas] = useState(true);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [calculatingFees, setCalculatingFees] = useState(false);
    const [fromWilayaId, setFromWilayaId] = useState(null);
    const [fees, setFees] = useState(null);

    // Charger les wilayas au montage
    useEffect(() => {
        loadWilayas();
    }, []);

    // Charger les communes quand wilaya change
    useEffect(() => {
        if (formData.wilayaId) {
            loadCommunes(formData.wilayaId);
        } else {
            setCommunes([]);
        }
    }, [formData.wilayaId]);

    // Calculer les frais quand commune change
    useEffect(() => {
        if (formData.wilayaId && formData.communeId && formData.totalPrice > 0 && fromWilayaId) {
            calculateFees();
        }
    }, [formData.wilayaId, formData.communeId, formData.totalPrice, fromWilayaId, formData.weight]);

    const loadWilayas = async () => {
        try {
            setLoadingWilayas(true);
            const data = await yalidineService.getWilayas();
            setWilayas(data);

            const oran = data.find(w => w.name.toLowerCase() === 'oran');
            if (oran) {
                setFromWilayaId(oran.id);
            } else {
                console.error('❌ Oran non trouvé dans les wilayas');
            }
        } catch (error) {
            console.error('❌ Erreur wilayas:', error);
            toast.error('Impossible de charger les wilayas');
        } finally {
            setLoadingWilayas(false);
        }
    };

    const loadCommunes = async (wilayaId) => {
        try {
            setLoadingCommunes(true);
            const data = await yalidineService.getCommunes(wilayaId);
            setCommunes(data);
        } catch (error) {
            console.error('❌ Erreur communes:', error);
            toast.error('Impossible de charger les communes');
        } finally {
            setLoadingCommunes(false);
        }
    };

    const calculateFees = async () => {
        if (!fromWilayaId) return;

        try {
            setCalculatingFees(true);
            const calculatedFees = await yalidineService.calculateFees({
                fromWilayaId: fromWilayaId,
                toWilayaId: formData.wilayaId,
                toCommuneId: formData.communeId,
                price: formData.totalPrice,
                declaredValue: formData.totalPrice,
                weight: formData.weight || 1,
                length: formData.length || 30,
                width: formData.width || 20,
                height: formData.height || 10,
                isStopDesk: false,
                freeShipping: false,
                doInsurance: true
            });

            setFees(calculatedFees);
            toast.success(`Frais de livraison: ${calculatedFees.deliveryFee} DA`, {
                icon: '📦',
                duration: 3000
            });
        } catch (error) {
            console.error('❌ Erreur calcul frais:', error);
            toast.error('Impossible de calculer les frais');
        } finally {
            setCalculatingFees(false);
        }
    };

    return {
        wilayas,
        communes,
        loadingWilayas,
        loadingCommunes,
        calculatingFees,
        fees,
        setFees
    };
};
