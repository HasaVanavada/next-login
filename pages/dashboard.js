import { useState } from 'react';
import { useSession } from 'next-auth/react';
import FileUpload from '../components/FileUpload';  // Import FileUpload component
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap'; // Import Bootstrap components

const Dashboard = ({ session }) => {
  const { status } = useSession();
  const [data, setData] = useState([]);  // Holds the CSV data
  const [columns, setColumns] = useState([]);  // Holds the columns
  const [columnMapping, setColumnMapping] = useState({});  // Holds the user-defined mappings
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) {
    router.push('/'); // Redirect to home if not authenticated
    return <div>Redirecting...</div>;
  }

  const handleMappingChange = (e, column) => {
    setColumnMapping((prev) => ({ ...prev, [column]: e.target.value }));
  };

  const handleDownloadJson = () => {
    const mappedData = data.map((row) => {
      const newRow = {};
      columns.forEach((col, index) => {
        const label = columnMapping[col] || col; 
        newRow[label] = row[index];  
      });
      return newRow;
    });

    const json = JSON.stringify(mappedData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapped_data.json';
    a.click();
  };

  return (
    <Container>
      <Row className="text-center">
        <Col>
          <h1 className="mb-4">CSV Upload and Mapping</h1>
          <FileUpload
            onDataParsed={(parsedData, parsedColumns) => {
              setData(parsedData);  
              setColumns(parsedColumns);  
            }}
          />

          {columns.length > 0 && (
            <div className="mt-5">
              <h2 className="mb-3">Map Columns</h2>
              <Table striped bordered hover className="column-mapping-table">
                <thead>
                  <tr>
                    <th>CSV Column</th>
                    <th>Label</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((col) => (
                    <tr key={col}>
                      <td>{col}</td>
                      <td>
                        <input
                          type="text"
                          value={columnMapping[col] || ''}
                          onChange={(e) => handleMappingChange(e, col)}
                          className="column-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button 
                variant="primary" 
                className="mt-4" 
                onClick={handleDownloadJson}>
                Generate JSON
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Dashboard;
