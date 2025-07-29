import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

type Props = {
    data: {
        name: string;
        count: number;
    }[];
};

const DashboardCharts = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DashboardCharts;
