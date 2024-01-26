import { Box, Text, Divider, Stack, Input, Checkbox, Radio, RadioGroup } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Controller, set, useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import axios from 'axios';

const Form = ({ control, customSelectStyles, setTasksForm, tech }) => {
  const [categories, setCategories] = useState(null);
  const [mainListCategory, setMainListCategory] = useState(null);
  const [mainListProblem, setMainListProblem] = useState(null);
  const [mainListCause, setMainListCause] = useState(null);
  const [improvements, setImprovements] = useState([]);
  const [showDropType, setShowDropType] = useState(false);
  const [showOnuType, setShowOnuType] = useState(false);
  const [showRouterType, setShowRouterType] = useState(false);
  const [showInputStockType, setShowInputStockType] = useState(false);
  const [data, setData] = useState({
    mainCategory: null,
    mainProblem: null,
    mainCause: null,
    stockType: null,
  });

  const selectMainCategoryRef = useRef();
  const selectMainProblemRef = useRef();
  const selectMainCauseRef = useRef();

  const handleSelectionMainCategory = (value) => {
    if (value) {
      value.label == 'Drop' ? setShowDropType(true) : setShowDropType(false);
      value.label == 'ONU' ? setShowOnuType(true) : setShowOnuType(false);
      value.label == 'Router' ? setShowRouterType(true) : setShowRouterType(false);

      data.mainProblem ? selectMainProblemRef.current.clearValue() : null;
      data.mainCause ? selectMainCauseRef.current.clearValue() : null;
      setMainListProblem(
        categories?.problem
          ?.filter((item) => item.parent_id == value.value)
          .map((item, i) => ({ value: item.id, label: item.name }))
      );
      setMainListCause(null);
      setShowInputStockType(false);

      setData({
        ...data,
        mainCategory: value,
        mainProblem: null,
        mainCause: null,
        stockType: null,
      });
    }
  };

  const handleSelectionMainProblem = (value) => {
    //console.log(value);
    if (value) {
      data.mainCause ? selectMainCauseRef.current.clearValue() : null;
      setMainListCause(
        categories?.cause
          ?.filter((item) => item.parent_id == value.value)
          .map((item, i) => ({ value: item.id, label: item.name }))
      );

      setData({
        ...data,
        mainProblem: value.value,
        mainCause: null,
      });
    }
  };

  const handleSelectionMainCause = (value) => {
    //console.log(value);
    if (value) {
      setData({
        ...data,
        mainCause: value.value,
      });
    }
  };

  const handleCheck = (e) => {
    let improvementsList = improvements;

    if (e.target.checked) {
      let label = e.nativeEvent.srcElement.labels;
      label = label[label.length - 1].innerText;

      improvementsList.push(label);
    } else {
      let label = e.nativeEvent.srcElement.labels;
      label = label[label.length - 1].innerText;

      improvementsList = improvementsList.filter((item) => item != label);
    }

    setImprovements(improvementsList);
    saveForm(improvementsList);
  };

  const handleInput = (e, type) => {
    if (e.target.value) {
      let improvementsList = improvements;

      if (type == 'other') {
        if (improvementsList.some((item) => item.match(/^Otro:/))) {
          improvementsList = improvementsList.filter((item) => !item.match(/^Otro:/));
          improvementsList.push(`Otro: ${e.target.value}`);
        } else {
          improvementsList.push(`Otro: ${e.target.value}`);
        }
      } else {
        if (improvementsList.some((item) => item.match(/^Modelo (Router|ONU):/))) {
          improvementsList = improvementsList.filter((item) => !item.match(/^Modelo (Router|ONU):/));
          improvementsList.push(`Modelo ${data.mainCategory.label}: ${e.target.value}`);
        } else {
          improvementsList.push(`Modelo ${data.mainCategory.label}: ${e.target.value}`);
        }
      }

      setImprovements(improvementsList);
      saveForm(improvementsList);
    }
  };

  const saveForm = (improvementsList) => {
    let form = {
      technology: tech,
      main_category: data.mainCategory,
      problem: data.mainProblem,
      stock_type: data.stockType ? data.stockType : null,
      cause: data.mainCause,
      improvements: improvementsList ? improvementsList : improvements,
    };

    setTasksForm(form);
  };

  useEffect(() => {
    axios
      .get('/api/technician/getTaskFormCategories')
      .then((res) => {
        setCategories(res.data);
        setMainListCategory(
          res.data.main_category
            .filter((item) => item.technology == tech)
            .map((item, i) => ({ value: item.id, label: item.name }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    saveForm();
  }, [data]);

  return (
    <Box>
      <FormControl>
        <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
          Causa Principal
        </FormLabel>
        <Text my={3} fontSize={14}>
          {' '}
          ¿En donde detecto la causa que genero que el cliente quede sin internet?{' '}
        </Text>
        <Controller
          control={control}
          name="main_category"
          rules={{ required: false }}
          render={({ field }) => (
            <Select
              {...field}
              ref={selectMainCategoryRef}
              autoFocus={true}
              isSearchable={true}
              options={mainListCategory}
              styles={customSelectStyles}
              placeholder={'Seleccionar...'}
              onChange={(value) => handleSelectionMainCategory(value)}
            />
          )}
        />
      </FormControl>
      {(showDropType || showOnuType || showDropType) && (
        <Divider my={4} borderBottomWidth={2} borderBottomColor={'blackAlpha.600'} />
      )}
      {showDropType && (
        <FormControl mt={4}>
          <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
            Tipo de Drop
          </FormLabel>
          <Text my={3} fontSize={14}>
            {' '}
            ¿Cuál es el tipo de Drop que se encontraba instalado en el domicilio del cliente?{' '}
          </Text>
          <Controller
            control={control}
            name="drop_type"
            rules={{ required: showDropType && !data.stockType }}
            render={({ field }) => (
              <Select
                {...field}
                autoFocus={true}
                isSearchable={true}
                options={categories?.drop?.map((item, i) => {
                  return { value: item.id, label: item.name };
                })}
                styles={customSelectStyles}
                placeholder={'Seleccionar...'}
                onChange={(e) => setData({ ...data, stockType: e.value })}
              />
            )}
          />
        </FormControl>
      )}
      {showOnuType && (
        <FormControl mt={4}>
          <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
            Tipo de ONU
          </FormLabel>
          <Text my={3} fontSize={14}>
            {' '}
            ¿Cuál es el tipo de ONU que se encontraba instalado en el domicilio del cliente?{' '}
          </Text>
          <Controller
            control={control}
            name="onu_type"
            rules={{ required: showOnuType && !data.stockType }}
            render={({ field }) => (
              <Select
                {...field}
                autoFocus={true}
                isSearchable={true}
                options={categories?.onu?.map((item, i) => {
                  return { value: item.id, label: item.name };
                })}
                styles={customSelectStyles}
                placeholder={'Seleccionar...'}
                onChange={(e) => {
                  setData({ ...data, stockType: e.value });
                  e.label == 'Media + Router' ? setShowInputStockType(true) : setShowInputStockType(false);
                }}
              />
            )}
          />
        </FormControl>
      )}

      {showRouterType && (
        <FormControl mt={4}>
          <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
            Tipo de Router
          </FormLabel>
          <Text my={3} fontSize={14}>
            {' '}
            ¿Cuál es el tipo de Router que se encontraba instalado en el domicilio del cliente?{' '}
          </Text>
          <Controller
            control={control}
            name="router_type"
            rules={{ required: showRouterType && !data.stockType }}
            render={({ field }) => (
              <Select
                {...field}
                autoFocus={true}
                isSearchable={true}
                options={categories?.router?.map((item, i) => {
                  return { value: item.id, label: item.name };
                })}
                styles={customSelectStyles}
                placeholder={'Seleccionar...'}
                onChange={(e) => {
                  setData({ ...data, stockType: e.value });
                  e.label == 'Otro' ? setShowInputStockType(true) : setShowInputStockType(false);
                }}
              />
            )}
          />
        </FormControl>
      )}

      {showInputStockType && (
        <Controller
          control={control}
          name="stock_input"
          rules={{ required: showInputStockType && !improvements.some((item) => item.match(/^Modelo (Router|ONU):/)) }}
          render={({ field }) => (
            <Input
              {...field}
              mt={3}
              placeholder={'Escriba el modelo del equipo...'}
              onChange={(e) => handleInput(e, 'stock')}
            />
          )}
        />
      )}

      <Divider my={4} borderBottomWidth={2} borderBottomColor={'blackAlpha.600'} />
      <FormControl mt={4}>
        <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
          Problema
        </FormLabel>
        <Text my={3} fontSize={14}>
          {' '}
          ¿Cuál fue el problema?{' '}
        </Text>
        <Controller
          control={control}
          name="main_problem"
          rules={{ required: false }}
          render={({ field }) => (
            <Select
              {...field}
              ref={selectMainProblemRef}
              autoFocus={true}
              isSearchable={true}
              isDisabled={mainListProblem == null}
              options={mainListProblem}
              styles={customSelectStyles}
              placeholder={'Seleccionar...'}
              onChange={(value) => handleSelectionMainProblem(value)}
            />
          )}
        />
      </FormControl>

      <Divider my={4} borderBottomWidth={2} borderBottomColor={'blackAlpha.600'} />
      <FormControl mt={4}>
        <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
          Causa
        </FormLabel>
        <Text my={3} fontSize={14}>
          {' '}
          En base a su análisis. ¿Qué genero que ocurriese esto?{' '}
        </Text>
        <Controller
          control={control}
          name="main_cause"
          rules={{ required: false }}
          render={({ field }) => (
            <Select
              {...field}
              ref={selectMainCauseRef}
              autoFocus={true}
              isSearchable={true}
              isDisabled={mainListCause == null}
              options={mainListCause}
              styles={customSelectStyles}
              placeholder={'Seleccionar...'}
              onChange={(value) => handleSelectionMainCause(value)}
            />
          )}
        />
      </FormControl>
      <Divider my={4} borderBottomWidth={2} borderBottomColor={'blackAlpha.600'} />
      {tech == 'W' ? (
        <Improvements_W handleCheck={handleCheck} handleInput={handleInput} />
      ) : (
        <Improvements_FO handleCheck={handleCheck} handleInput={handleInput} />
      )}
    </Box>
  );
};

const Improvements_W = ({ handleCheck, handleInput }) => {
  return (
    <FormControl mt={4}>
      <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
        Mejoras
      </FormLabel>
      <Text my={3} fontSize={15}>
        {' '}
        Para finalizar seleccione que mejoras realizo en el domicilio.{' '}
      </Text>
      <Text fontSize={14}>Antena</Text>
      <Stack spacing={2} ml={4}>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Colocación de antirrobo</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Colocación de antirrotor</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Mejora del amurado</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Mejora de retenciones</Text>
        </Checkbox>
      </Stack>
      <Text fontSize={14} mt={2}>
        UTP
      </Text>
      <Stack spacing={2} ml={4}>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se colocan grampas</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se realiza gotero</Text>
        </Checkbox>
      </Stack>
      <Text fontSize={14} mt={2}>
        Alimentación
      </Text>
      <Stack spacing={2} ml={4}>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se coloca POE correcto</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se coloca transformador correcto</Text>
        </Checkbox>
      </Stack>
      <Text fontSize={14} mt={2}>
        Router
      </Text>
      <Stack spacing={2} ml={4}>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se amura el router</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se coloca router en cascada</Text>
        </Checkbox>
      </Stack>
      <Text fontSize={14} mt={2}>
        Patch
      </Text>
      <Stack spacing={2} ml={4}>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se cambia patch</Text>
        </Checkbox>
      </Stack>
      <Text fontSize={14} mt={2}>
        RJ45
      </Text>
      <Stack spacing={2} ml={4}>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Se cambia RJ45</Text>
        </Checkbox>
      </Stack>
      <Text fontSize={14} mt={2}>
        Otro
      </Text>
      <Input name="otro" placeholder={'Describa la mejora...'} onChange={(e) => handleInput(e, 'other')} />
    </FormControl>
  );
};

const Improvements_FO = ({ handleCheck, handleInput }) => {
  return (
    <FormControl mt={4}>
      <FormLabel bg={'blue.500'} color={'white'} textAlign={'center'} rounded={10}>
        Mejoras
      </FormLabel>
      <Text my={3} fontSize={15}>
        {' '}
        Para finalizar seleccione que mejoras realizo en el domicilio.{' '}
      </Text>
      <Stack spacing={2} ml={4}>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Mejora de cobertura WIFI (movimiento de ONU)</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Amurado de ONU</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Anulación de Roseta</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Mejora de cableado Interno</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Realización de gotero</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Colocación de cadena</Text>
        </Checkbox>
        <Checkbox onChange={handleCheck}>
          <Text fontSize={14}>Mejora de tendido externo</Text>
        </Checkbox>
        <Text fontSize={14} mt={2}>
          Otro
        </Text>
        <Input name="otro" placeholder={'Describa la mejora...'} onChange={(e) => handleInput(e, 'other')} />
      </Stack>
    </FormControl>
  );
};

export default Form;
