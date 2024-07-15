import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Icon, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import PentagonOutlinedIcon from '@mui/icons-material/PentagonOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import { usePatientMRN } from '../../../../util/urlHelpers.js';
import { TEST_PATIENT_INFO } from '../../../../util/data/PatientSample.js';

const ProblemListTabContent = ({ children, ...other }) => {
  const [patientMRN, setPatientMRN] = usePatientMRN();
  const patientData = TEST_PATIENT_INFO({ patientMRN });
  const diagnosesArray = patientData.diagnosisList;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiagnoses, setFilteredDiagnoses] = useState(diagnosesArray);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null); // Track selected diagnosis
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [problems, setProblems] = useState(patientData.problems); // State to hold problems array

  useEffect(() => {
    setFilteredDiagnoses(
      diagnosesArray.filter(diagnosis => 
        diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, diagnosesArray]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDiagnosis(null); // Clear selected diagnosis on modal close
  };

  const handleDiagnosisClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis === selectedDiagnosis ? null : diagnosis);
  };

  const handleAccept = () => {
    if (selectedDiagnosis) {
      const newProblem = {
        diagnosis: selectedDiagnosis,
        // Add other properties as needed for the new problem row
      };
      setProblems([...problems, newProblem]);
    }
    handleCloseModal();
  };

  return (
    <div className="tab-content-container">
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em', marginTop: '1em', marginRight: '1em', marginLeft: '1em'}}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Search for problem"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={handleOpenModal}
              style={{ marginRight: 0 }}
            />
            <Button
              variant="outlined"
              style={{ height: '56px', marginLeft: '-1px' }} // Adjust marginLeft to remove space
            >
              <Icon color="success">add_task</Icon>Add
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1em' }}>
            <Typography>Show:</Typography>
            <Checkbox name="showPastProblems" />
            <Typography>Past Problems</Typography>
            <Button variant="outlined" style={{ marginLeft: '1em' }}>
              View Drug-Disease Interactions
            </Button>
          </div>
        </div>
        <TableContainer component={Paper} style={{ marginTop: '1em' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '60%' }}>Diagnosis</TableCell>
                <TableCell style={{ width: '13%' }}>Notes</TableCell>
                <TableCell style={{ width: '5%' }}>Hospital</TableCell>
                <TableCell style={{ width: '5%' }}>Principal</TableCell>
                <TableCell style={{ width: '7%' }}>Change Dx</TableCell>
                <TableCell style={{ width: '5%' }}>Resolved</TableCell>
                <TableCell style={{ width: '5%' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map((problem, index) => ( // Use problems state for rendering
                <TableRow key={index}>
                  <TableCell>{problem.diagnosis}</TableCell>
                  <TableCell>
                    <Button>Create Overview</Button>
                  </TableCell>
                  <TableCell>
                    <Checkbox name="hospitalCheckbox" />
                  </TableCell>
                  <TableCell>
                    <Button><PentagonOutlinedIcon/></Button>
                  </TableCell>
                  <TableCell>
                    <Button><ChangeHistoryIcon /></Button>
                  </TableCell>
                  <TableCell>
                    <Button><ClearIcon /></Button>
                  </TableCell>
                  <TableCell>
                    <Button><KeyboardDoubleArrowDownOutlinedIcon /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="search-modal-title"
        aria-describedby="search-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <TextField
              label="Search for problem"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '1em' }}
            />
            <Button
              variant="outlined"
              style={{ height: '56px', marginLeft: '-1px' }} // Adjust marginLeft to remove space
            >
              <Icon color="success">add_task</Icon>Add
            </Button>
            <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Diagnosis</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDiagnoses.map((diagnosis, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleDiagnosisClick(diagnosis)}
                      style={{ cursor: 'pointer', backgroundColor: selectedDiagnosis === diagnosis ? '#e0f7fa' : 'inherit' }}
                    >
                      <TableCell>{diagnosis}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAccept}
              style={{ marginRight: '1em' }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ProblemListTabContent;
