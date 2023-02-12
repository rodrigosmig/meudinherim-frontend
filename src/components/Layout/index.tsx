
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { memo, ReactNode, useEffect } from 'react';
import { useDispatch } from '../../hooks/useDispatch';
import { useSelector } from '../../hooks/useSelector';
import { tokenService } from '../../services/tokenService';
import { updateData } from '../../store/thunks/authThunk';
import { Card } from '../Card';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface Props extends BoxProps {
  isDashboard?: boolean
  children: ReactNode
}

const LayoutComponent = ({ children, isDashboard = false, }: Props) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(({auth}) => auth);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
		const {token} = tokenService.get(null)

		if(token && !isAuthenticated) {
			dispatch(updateData())
		}
	}, [dispatch, isAuthenticated])

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Header />   
        <Box 
          ml={{ base: 0, md: 60 }} 
          p="4" 
          bg={bgColor}
        >
          { isDashboard ? (
            children
          ) : (
            <Card>
              {children}
            </Card>
          )}
        </Box>
    </Box>
  )
}

export const Layout = memo(LayoutComponent);