import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { CircularProgress, Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NoteViewPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {

        let url;

        const loadPdf = async () => {

            try {

                const response = await api.get(
                    `/notes/view/${id}`,
                    {
                        responseType: "blob"
                    }
                );

                url = URL.createObjectURL(response.data);

                setPdfUrl(url);

            } catch (e) {

                console.error(e);

            }

        };

        loadPdf();

        return () => {

            if (url) {
                URL.revokeObjectURL(url);
            }

        };

    }, [id]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
            <AppBar position="static" color="inherit" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                <Toolbar variant="dense">
                    <IconButton edge="start" onClick={() => navigate("/notes")} aria-label="Back to notes">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1 }}>
                        StudyStack Notes
                    </Typography>
                </Toolbar>
            </AppBar>

            {!pdfUrl ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow={1}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <iframe
                    src={pdfUrl}
                    title="StudyStack Notes"
                    width="100%"
                    style={{
                        border: "none",
                        flexGrow: 1,
                    }}
                />
            )}
        </Box>
    );

}
