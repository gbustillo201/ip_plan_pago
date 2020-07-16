import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectClientData} from "../Subscription/subscriptionSlice";
import {fetchCuotas, fetchDistribucionCuotas, subscribePlanPago} from "../../services/cuotasApi";
import {Button, Dropdown, DropdownButton, Modal} from "react-bootstrap";
import useAPICall from "../../useAPICall";
import QRCode from "qrcode.react";

import {useGoogleReCaptcha} from 'react-google-recaptcha-v3';

import {useHistory} from "react-router-dom";
import {DistribucionCuotas} from "../../components/DistribucionCuotas";
import {EstadoCuenta} from "../../components/EstadoCuenta";
import {ProyeccionMultas} from "../../components/ProyeccionMultas";


const Cuotas = ({cuotas, setSelectedCuota}) => {
    const [title, setTitle] = useState("Seleccione las cuotas");
    const handleSelect = (e) => {
        setSelectedCuota(e);
        setTitle(`${e} cuotas`);
    };
    return (
        <DropdownButton
            id="cuotas"
            title={title}
            variant="primary"
            drop="down"
            onSelect={handleSelect}
        >
            {cuotas.map((cuota) => {
                return (
                    <Dropdown.Item
                        key={cuota.clave}
                        eventKey={cuota.valor}
                    >{`${cuota.valor} cuotas`}</Dropdown.Item>
                );
            })}
        </DropdownButton>
    );
};

const ResultModal = ({showModal, handleClose, codigoPlanPago}) => {
    const history = useHistory();
    const url = `${process.env.REACT_APP_PLAN}?planpago=${codigoPlanPago}`;
    return (
        <Modal show={showModal} onHide={handleClose}>

            <Modal.Header closeButton>
                <Modal.Title className="modal-title">Confirmación de Plan de Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-description mt-4">Se ha generado el siguiente número de plan de pago: </p>
                <div className="alert alert-primary" role="alert">
                    <h4>{codigoPlanPago}</h4>
                </div>
                <hr/>
                <p className="text-description mb-0">Escanee con su celular el siguiente código QR o ingrese a la
                    página mediante el link.</p>
                <QRCode className="qr-box" value={url}/>
                <div className="link-container">
                    <a className="links" href={url}>{url}</a>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => history.push(`/?planpago=${codigoPlanPago}`)}>
                    Imprimir Convenio
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const Account = () => {
    const history = useHistory();
    const {placa, propietario, estadoCuenta, rtn, identidad, nombreRegistrado } = useSelector(
        selectClientData
    );
    if (!placa) {
        history.push("/")
    }

    const {executeRecaptcha} = useGoogleReCaptcha();

    const [cuotas, setCuotas] = useState([]);
    const [resultCuotas, , startCuotas] = useAPICall(fetchCuotas);
    const [resultDistribucion, , startDistribucion] = useAPICall(
        fetchDistribucionCuotas
    );

    const {proyeccionMultas} = resultDistribucion || {}

    const [token, setToken] = useState(null);

    const [selectedCuota, setSelectedCuota] = useState(0);

    const [resultSubscription, , startPlanPagos] = useAPICall(subscribePlanPago);

    const [codigoPlanDePago, setCodigoPlanDePago] = useState(0);

    const [showModal, setShowModal] = useState(false);

    const acceptPlan = async () => {
        const token = await executeRecaptcha('submit')
        setToken(token)
    }
    useEffect(() => {
        if (token) {
             startPlanPagos({placa, cuotas: selectedCuota, id: identidad, name: nombreRegistrado, token});
        }
    }, [token, startPlanPagos])

    useEffect(()=> {
        if(resultSubscription){
            const {registro} = resultSubscription;
            setCodigoPlanDePago(registro);
            setShowModal(true)
        }

    }, [resultSubscription]);

    useEffect(() => {
        startCuotas();
    }, [startCuotas]);

    useEffect(() => {
        if (resultCuotas) {
            setCuotas(resultCuotas);
        }
    }, [resultCuotas]);

    useEffect(() => {
       
            startDistribucion({placa, cuotas: selectedCuota});
       
    }, [placa, selectedCuota, startDistribucion]);

    return (
        <>
            <ResultModal showModal={showModal} codigoPlanPago={codigoPlanDePago} handleClose={() => setShowModal(false)}/>
            <div className="card w-100">
                <img
                    className="card-media mx-auto d-block"
                    src={process.env.PUBLIC_URL + "/logo IP.png"}
                    alt=""
                />
                <div className="card-body">
                    <div id="subscription">
                        <h4 className="card-title">Plan de Pago</h4>
                        <p className="card-description">
                            Confirme sus datos e ingrese el plan de pago de conveniencia.
                        </p>
                        <hr/>
                        <div className="plan-pago">
                            <h5>Datos personales</h5>
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <p className="label-list">Placa de vehículo:</p>
                                    <p className="info-list">{placa}</p>
                                </li>
                                <li className="list-group-item">
                                    <p className="label-list">RTN:</p>
                                    <p className="info-list">{rtn}</p>
                                </li>
                                <li className="list-group-item">
                                    <p className="label-list">Nombre del propietario:</p>
                                    <p className="info-list">{propietario}</p>
                                </li>
                            </ul>
                            <EstadoCuenta estadoCuenta={estadoCuenta}/>
                        </div>

                        <p className="text-muted mt-3">
                            Seleccione el número de cuotas para su Plan de Pago
                        </p>
                        {/* <Cuotas cuotas={cuotas} setSelectedCuota={setSelectedCuota}/> */}
                        <DistribucionCuotas distribucion={resultDistribucion}/>
                        <ProyeccionMultas proyeccionMultas={proyeccionMultas}/>




                    </div>
                    <div className="form-actions mt-3">

                        {selectedCuota === 0 && <Button className="mr-1"  variant="primary" onClick={acceptPlan}>
                            Aceptar Plan de Pago
                        </Button>}
                        {selectedCuota === 0 && <Button  variant="secondary"
                                                          onClick={() => history.push("/")}>
                            Rechazar Plan de Pago
                        </Button>}


                    </div>
                </div>

            </div>

        </>


    );
};

export default Account;
